import EmptyMap from 'datamaps/dist/datamaps.none.min.js';
import * as topojson from 'topojson';
import * as D3 from 'd3';
import $ from 'jquery';
import getAllCountries from '../helpers/getAllCountries';
import retrieveCountryInfo from '../helpers/retrieveCountryInfo';

class ManipulateGeoMap {
    // Determine if potential country is visible on map
    isRegionVisible(projection, regionGeoJson, mapWidth, mapHeight, region, neighbor) {
        const iso = neighbor.cca3.toUpperCase();
        if (iso == 'RUS') return true; // Too hard to try and calculate whether to render Russia, so just always render
        for (let i = 0; i < region.borders.length; i++) {
            if (iso == region.borders[i]) return true;
        }
        
        const regionBBox = D3.geoBounds(regionGeoJson);

        const regionLeftTop = projection([regionBBox[0][0], regionBBox[1][1]]);
        const regionLeftBottom = projection([regionBBox[0][0], regionBBox[0][1]]);
        const regionRightTop = projection([regionBBox[1][0], regionBBox[1][1]]);
        const regionRightBottom = projection([regionBBox[1][0], regionBBox[0][1]]);

        const boundDelta = 13; // Because projection is curved, delta helps to offset the bounding box's 'curvature'
        const mapLeftBound = -boundDelta;
        const mapRightBound = mapWidth + boundDelta;
        const mapBottomBound = mapHeight + boundDelta;
        const mapTopBound = -boundDelta;

        // Check whether corners of potential country's bounding box are contained in map
        if (
            regionLeftTop[0] > mapLeftBound && regionLeftTop[0] < mapRightBound && regionLeftTop[1] > mapTopBound && regionLeftTop[1] < mapBottomBound ||
            regionLeftBottom[0] > mapLeftBound && regionLeftBottom[0] < mapRightBound && regionLeftBottom[1] > mapTopBound && regionLeftBottom[1] < mapBottomBound ||
            regionRightTop[0] > mapLeftBound && regionRightTop[0] < mapRightBound && regionRightTop[1] > mapTopBound && regionRightTop[1] < mapBottomBound ||
            regionRightBottom[0] > mapLeftBound && regionRightBottom[0] < mapRightBound && regionRightBottom[1] > mapTopBound && regionRightBottom[1] < mapBottomBound
        ) {
            return true;
        }
        return false;
    }

    // Retrieve the surrounding regions
    getNeighboringRegions(region, projection, mapWidth, mapHeight) {
        const regionIso = region.cca3.toLowerCase();
        const neighborsArray = [];

        const countries = getAllCountries();
        countries.forEach(country => {
            const iso = country.cca3.toLowerCase();
            if (iso == regionIso) return; // Don't count the filtered country as a neighboring country
            const regionInfo = this.getRegionMapAndGeoJson(country);
            if (this.isRegionVisible(projection, regionInfo.regionGeoJson, mapWidth, mapHeight, region, country)) {
                neighborsArray.push(country);
            }
        });
        return neighborsArray;
    }

    // Include the surrounding countries when zoomed-in on a region
    addSurroundingRegions(region, RegionMap, geoJson, projection, mapWidth, mapHeight) {
        const iso = region.cca3.toLowerCase();
        const mainTopo = JSON.parse(JSON.stringify(RegionMap.prototype[iso + 'Topo']));

        const neighborsArray = this.getNeighboringRegions(region, projection, mapWidth, mapHeight);
        neighborsArray.forEach(neighbor => {
            const neighborInfo = this.getRegionMapAndGeoJson(neighbor);
            const neighborGeoJson = neighborInfo.regionGeoJson;
            geoJson.features.push(neighborGeoJson.features[0]);
        });

        const newTopo = topojson.topology([geoJson]);
        const objectIso = Object.keys(newTopo.objects)[0];
        if (objectIso != iso) {
            Object.defineProperty(
                newTopo.objects,
                iso,
                Object.getOwnPropertyDescriptor(newTopo.objects, objectIso)
            );
            delete newTopo.objects[objectIso];
        }
        EmptyMap.prototype[iso + 'Topo'] = newTopo;

        return EmptyMap;
    }

    // Create topojson for iso that's currently a 'territory' of another country
    createMissingTopojson(CountryMap, isoTerritory, isoCountry) {
        let territoryInfo;
        if (isoTerritory == 'bes') {
            territoryInfo = {name: {common: 'Caribbean Netherlands', official: 'Bonaire, Sint Eustatius, and Saba'}, iso: 'BES', altSpellings: ['Bonaire, St. Eustatius, and Saba']};
        } else {
            territoryInfo = retrieveCountryInfo(isoTerritory);
        }

        // Add territory's topojson
        let countryTopo = JSON.parse(JSON.stringify(CountryMap.prototype[isoCountry + 'Topo']));
        let geometries = countryTopo.objects[isoCountry].geometries;
        geometries = geometries.filter(geometry => {
            const territoryInfoString = JSON.stringify(territoryInfo);
            return territoryInfoString.indexOf(geometry.properties.name) >= 0;
        });
        geometries.forEach(geometry => {
            geometry.properties.name = territoryInfo.name.common;
            geometry.properties.iso = isoTerritory.toUpperCase();
        });

        if (isoTerritory == 'sjm') { // Add Jan Mayen to Svalbard and Jan Mayen topojson
            const index = geometries[0].arcs.findIndex(arc => {
                return arc[0] == 89;
            });
            if (index < 0) {
                geometries[0].arcs.push([[89]]);
            }
        }

        countryTopo.objects[isoCountry].geometries = geometries;
        CountryMap.prototype[isoTerritory + 'Topo'] = countryTopo;

        // Remove territory from country's topojson
        countryTopo = CountryMap.prototype[isoCountry + 'Topo'];
        geometries = countryTopo.objects[isoCountry].geometries;
        geometries = geometries.filter(geometry => {
            const territoryInfoString = JSON.stringify(territoryInfo);
            return territoryInfoString.indexOf(geometry.properties.name) < 0;
        });

        if (isoCountry == 'nor') { // Remove Jan Mayen from Norway topojson
            let arcIndex = -1;
            const arrayIndex = geometries.findIndex(geometry => {
                arcIndex = geometry.arcs.findIndex(arc => {
                    return arc[0] == 89;
                });
                return arcIndex >= 0;
            });
            
            if (arcIndex >= 0) {
                geometries[arrayIndex].arcs.splice(arcIndex, 1);
            }
        }
        
        countryTopo.objects[isoCountry].geometries = geometries;
        CountryMap.prototype[isoCountry + 'Topo'] = countryTopo;
    }

    // Prepare country's topojson
    prepareCountryTopo(region, countryTopo) {
        const iso = region.cca3.toLowerCase();
        const countryGeometries = countryTopo.objects[iso].geometries;
        const customGeoJsonObj = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    id: iso.toUpperCase(),
                    properties: {name: region.name.common, iso: iso.toUpperCase()},
                    geometry: topojson.merge(countryTopo, countryGeometries)
                }
            ]
        }

        countryTopo = topojson.topology([customGeoJsonObj]);
        const objectIso = Object.keys(countryTopo.objects)[0];
        if (objectIso != iso) {
            Object.defineProperty(
                countryTopo.objects,
                iso,
                Object.getOwnPropertyDescriptor(countryTopo.objects, objectIso)
            );
            delete countryTopo.objects[objectIso];
        }

        // Remove Baikonur outline from Kazakhstan
        if (iso == 'kaz') {
            const kazArcs = countryTopo.objects.kaz.geometries[0].arcs;
            const arcArrayWithBaikonur = kazArcs.find(arcArray => {
                return arcArray.length == 2;
            });
            if (arcArrayWithBaikonur) {
                const indexToRemove = arcArrayWithBaikonur.findIndex(arc => {
                    return arc[0] == 3;
                });
                arcArrayWithBaikonur.splice(indexToRemove, 1);
            } 
        }

        return countryTopo;
    }

    // Get a region's map and geoJson. Handle exceptions.
    getRegionMapAndGeoJson(region) {
        if (region.name.common == 'World') {
            const WorldMap = require(`datamaps/dist/datamaps.all.hires.min.js`);
            const worldTopo = WorldMap.prototype.worldTopo;
            const worldObjects = worldTopo.objects.world;
            const worldGeoJson = topojson.feature(worldTopo, worldObjects);
    
            return {RegionMap: WorldMap, regionGeoJson: worldGeoJson};
        }

        let iso = region.cca3.toLowerCase();
        let CountryMap;
        let countryTopo;

        // Exception: Cocos (Keeling) Islands & Christmas Island
        if (iso == 'cck' || iso == 'cxr') {
            CountryMap = require(`datamaps/dist/datamaps.ioa.min.js`);
            const cckTopo = Object.assign({}, CountryMap.prototype.cckTopo);
            const cxrTopo = Object.assign({}, CountryMap.prototype.cxrTopo);
            if ($.isEmptyObject(cckTopo)) {
                this.createMissingTopojson(CountryMap, 'cck', 'ioa');
            }
            if ($.isEmptyObject(cxrTopo)) {
                this.createMissingTopojson(CountryMap, 'cxr', 'ioa');
            }
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }

        // Exception: France
        // Territories: Guadaloupe, French Guiana, Martinique, Mayotte, and Réunion
        else if (iso == 'fra' || iso == 'glp' || iso == 'guf' || iso == 'mtq' || iso == 'myt' || iso == 'reu') {
            CountryMap = require(`datamaps/dist/datamaps.fra.min.js`);
            const glpTopo = Object.assign({}, CountryMap.prototype.glpTopo);
            const gufTopo = Object.assign({}, CountryMap.prototype.gufTopo);
            const mtqTopo = Object.assign({}, CountryMap.prototype.mtqTopo);
            const mytTopo = Object.assign({}, CountryMap.prototype.mytTopo);
            const reuTopo = Object.assign({}, CountryMap.prototype.reuTopo);
            if ($.isEmptyObject(glpTopo)) {
                this.createMissingTopojson(CountryMap, 'glp', 'fra');
            }
            if ($.isEmptyObject(gufTopo)) {
                this.createMissingTopojson(CountryMap, 'guf', 'fra');
            }
            if ($.isEmptyObject(mtqTopo)) {
                this.createMissingTopojson(CountryMap, 'mtq', 'fra');
            }
            if ($.isEmptyObject(mytTopo)) {
                this.createMissingTopojson(CountryMap, 'myt', 'fra');
            }
            if ($.isEmptyObject(reuTopo)) {
                this.createMissingTopojson(CountryMap, 'reu', 'fra');
            }
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }
        
        // Exception: Netherlands
        // Territories: Bonaire, Sint Eustatius, and Saba (Caribbean Netherlands)
        else if (iso == 'nld' || iso == 'bes') {
            CountryMap = require(`datamaps/dist/datamaps.nld.min.js`);
            const besTopo = Object.assign({}, CountryMap.prototype.besTopo);
            if ($.isEmptyObject(besTopo)) {
                this.createMissingTopojson(CountryMap, 'bes', 'nld');
            }
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }

        // Exception: Saint Helena, Ascension, and Tristan da Cunha
        // Territories: Saint Helena, Ascension, and Tristan da Cunha (split up)
        else if (iso == 'shn' || iso == 'asc' || iso == 'taa') {
            CountryMap = require(`datamaps/dist/datamaps.shn.min.js`);
            const ascTopo = Object.assign({}, CountryMap.prototype.ascTopo);
            const taaTopo = Object.assign({}, CountryMap.prototype.taaTopo);
            if ($.isEmptyObject(ascTopo)) {
                this.createMissingTopojson(CountryMap, 'asc', 'shn');
            }
            if ($.isEmptyObject(taaTopo)) {
                this.createMissingTopojson(CountryMap, 'taa', 'shn');
            }
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }
        
        // Exception: Norway
        // Territories: Bouvet Island and Svalbard and Jan Mayen
        else if (iso == 'nor' || iso == 'bvt' || iso == 'sjm') {
            CountryMap = require(`datamaps/dist/datamaps.nor.min.js`);
            const bvtTopo = Object.assign({}, CountryMap.prototype.bvtTopo);
            const sjmTopo = Object.assign({}, CountryMap.prototype.sjmTopo);
            if ($.isEmptyObject(bvtTopo)) {
                this.createMissingTopojson(CountryMap, 'bvt', 'nor');
            }
            if ($.isEmptyObject(sjmTopo)) {
                this.createMissingTopojson(CountryMap, 'sjm', 'nor');
            }
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }
        
        // Exception: New Zealand
        // Territories: Tokelau
        else if (iso == 'nzl' || iso == 'tkl') {
            CountryMap = require(`datamaps/dist/datamaps.nzl.min.js`);
            const tlkTopo = Object.assign({}, CountryMap.prototype.tklTopo);
            if ($.isEmptyObject(tlkTopo)) {
                this.createMissingTopojson(CountryMap, 'tkl', 'nzl');
            }
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }

        // Everything else
        else {
            if (iso == 'ala') iso = 'ald'; // Adjust for difference in datamaps library
            if (iso == 'pse') iso = 'psx'; // Adjust for difference in datamaps library
            if (iso == 'esh') iso = 'sah'; // Adjust for difference in datamaps library
            if (iso == 'ssd') iso = 'sds'; // Adjust for difference in datamaps library
            if (iso == 'unk') iso = 'kos'; // Adjust for difference in datamaps library
            CountryMap = require(`datamaps/dist/datamaps.${iso}.min.js`);
            countryTopo = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
            if (iso == 'ald') iso = 'ala'; // Adjust for difference in datamaps library
            if (iso == 'psx') iso = 'pse'; // Adjust for difference in datamaps library
            if (iso == 'sah') iso = 'esh'; // Adjust for difference in datamaps library
            if (iso == 'sds') iso = 'ssd'; // Adjust for difference in datamaps library
            if (iso == 'kos') iso = 'unk'; // Adjust for difference in datamaps library
        }
        // Make sure the topojson's object exactly matches the iso
        const objectIso = Object.keys(countryTopo.objects)[0];
        if (objectIso != iso) {
            Object.defineProperty(
                countryTopo.objects,
                iso,
                Object.getOwnPropertyDescriptor(countryTopo.objects, objectIso)
            );
            delete countryTopo.objects[objectIso];
        }
        // Make sure country's ID and properties are correct
        if (countryTopo.objects[iso].geometries[0].id != iso.toUpperCase()) {
            countryTopo.objects[iso].geometries[0].id = iso.toUpperCase();
            countryTopo.objects[iso].geometries[0].properties
                = {name: retrieveCountryInfo(iso).name.common, iso: iso.toUpperCase()};
            CountryMap.prototype[iso + 'Topo'] = countryTopo;
        }

        countryTopo = this.prepareCountryTopo(region, countryTopo);
        const countryObjects = countryTopo.objects[iso];
        const countryGeoJson = topojson.feature(countryTopo, countryObjects);
        CountryMap.prototype[iso + 'Topo'] = countryTopo;

        return {RegionMap: CountryMap, regionGeoJson: countryGeoJson};
    }
}

export default ManipulateGeoMap;