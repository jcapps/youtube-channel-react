import EmptyMap from 'datamaps/dist/datamaps.none.min.js';
import * as topojson from 'topojson';
import * as D3 from 'd3';
import $ from 'jquery';
import getAllCountries from '../helpers/getAllCountries';
import retrieveCountryInfo from '../helpers/retrieveCountryInfo';

class ManipulateGeoMap {
    // Set object key of topojson object to be same as country's iso
    setObjectIso(topo, iso) {
        const objectIso = Object.keys(topo.objects)[0];
        if (objectIso != iso) {
            Object.defineProperty(
                topo.objects,
                iso,
                Object.getOwnPropertyDescriptor(topo.objects, objectIso)
            );
            delete topo.objects[objectIso];
        }
        return topo;
    }

    // Determine if potential country is visible on map
    isRegionVisible(projection, regionGeoJson, mapWidth, mapHeight, region, neighbor) {
        const iso = neighbor.cca3.toUpperCase();
        for (let i = 0; i < region.borders.length; i++) {
            if (iso == region.borders[i]) return true;
        }
        // Handle exceptions here
        const mainIso = region.cca3.toUpperCase();
        if (mainIso == 'ATA' && iso == 'BRA') return true; // Don't need this if set boundDelta = 4+
        if (mainIso == 'BGD' && iso == 'CHN') return true;
        if (mainIso == 'BHS' && iso == 'USA') return true;
        if (mainIso == 'CUB' && iso == 'USA') return true;
        if (mainIso == 'DEU' && iso == 'RUS') return true;
        if (mainIso == 'GBR' && iso == 'ITA') return true; // Don't need this if set boundDelta = 5+
        if (mainIso == 'GGY' && iso == 'FRA') return true;
        if (mainIso == 'GRL' && iso == 'RUS') return true;
        if (mainIso == 'IRN' && iso == 'RUS') return true;
        if (mainIso == 'JPN' && iso == 'RUS') return true;
        if (mainIso == 'NLD' && iso == 'GBR') return true;
        if (mainIso == 'SGP' && iso == 'MYS') return true;
        if (mainIso == 'SJM' && iso == 'RUS') return true;
        if (mainIso == 'SWE' && iso == 'RUS') return true;
        if (mainIso == 'TTO' && iso == 'VEN') return true;
        if (mainIso == 'TUR' && iso == 'RUS') return true;
        if (mainIso == 'TWN' && iso == 'CHN') return true;

        const regionBBox = D3.geoBounds(regionGeoJson);

        const regionLeftTop = projection([regionBBox[0][0], regionBBox[1][1]]);
        const regionLeftBottom = projection([regionBBox[0][0], regionBBox[0][1]]);
        const regionRightTop = projection([regionBBox[1][0], regionBBox[1][1]]);
        const regionRightBottom = projection([regionBBox[1][0], regionBBox[0][1]]);
        const regionCenterLeft = projection([regionBBox[0][0], (regionBBox[1][1] + regionBBox[0][1]) / 2]);
        const regionCenterBottom = projection([(regionBBox[1][0] + regionBBox[0][0]) / 2, regionBBox[0][1]]);
        const regionCenterRight = projection([regionBBox[1][0], (regionBBox[1][1] + regionBBox[0][1]) / 2]);
        const regionCenterTop = projection([(regionBBox[1][0] + regionBBox[0][0]) / 2, regionBBox[1][1]]);

        const boundDelta = 0; // Because projection is curved, delta helps to offset the bounding box's 'curvature'
        const mapLeftBound = -boundDelta;
        const mapRightBound = mapWidth + boundDelta;
        const mapBottomBound = mapHeight + boundDelta;
        const mapTopBound = -boundDelta;

        // Check whether corners of potential country's bounding box are contained in map
        if (
            regionLeftTop[0] > mapLeftBound && regionLeftTop[0] < mapRightBound && regionLeftTop[1] > mapTopBound && regionLeftTop[1] < mapBottomBound ||
            regionLeftBottom[0] > mapLeftBound && regionLeftBottom[0] < mapRightBound && regionLeftBottom[1] > mapTopBound && regionLeftBottom[1] < mapBottomBound ||
            regionRightTop[0] > mapLeftBound && regionRightTop[0] < mapRightBound && regionRightTop[1] > mapTopBound && regionRightTop[1] < mapBottomBound ||
            regionRightBottom[0] > mapLeftBound && regionRightBottom[0] < mapRightBound && regionRightBottom[1] > mapTopBound && regionRightBottom[1] < mapBottomBound ||
            regionCenterLeft[0] > mapLeftBound && regionCenterLeft[0] < mapRightBound && regionCenterLeft[1] > mapTopBound && regionCenterLeft[1] < mapBottomBound ||
            regionCenterBottom[0] > mapLeftBound && regionCenterBottom[0] < mapRightBound && regionCenterBottom[1] > mapTopBound && regionCenterBottom[1] < mapBottomBound ||
            regionCenterRight[0] > mapLeftBound && regionCenterRight[0] < mapRightBound && regionCenterRight[1] > mapTopBound && regionCenterRight[1] < mapBottomBound ||
            regionCenterTop[0] > mapLeftBound && regionCenterTop[0] < mapRightBound && regionCenterTop[1] > mapTopBound && regionCenterTop[1] < mapBottomBound
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
                neighborsArray.push(regionInfo.regionGeoJson);
            }
        });
        return neighborsArray;
    }

    // Include the surrounding countries when zoomed-in on a region
    addSurroundingRegions(region, RegionMap, geoJson, projection, mapWidth, mapHeight) {
        const iso = region.cca3.toLowerCase();
        const mainTopo = JSON.parse(JSON.stringify(RegionMap.prototype[iso + 'Topo']));

        const neighborsArray = this.getNeighboringRegions(region, projection, mapWidth, mapHeight);
        neighborsArray.forEach(neighborGeoJson => {
            geoJson.features.push(neighborGeoJson.features[0]);
        });

        let newTopo = topojson.topology([geoJson]);
        newTopo = this.setObjectIso(newTopo, iso);
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
        if (countryGeometries.length == 1) { // Don't waste time doing an unnecessary merge call
            return countryTopo;
        }

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
        countryTopo = this.setObjectIso(countryTopo, iso);

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

        // Exception: Somalia
        // Territories: Somaliland (merge with Somalia)
        else if (iso == 'som') {
            CountryMap = require(`datamaps/dist/datamaps.som.min.js`);
            let somTopo = Object.assign({}, CountryMap.prototype.somTopo);
            if (somTopo.objects.som.geometries.length > 1) { // If not already merged
                const somGeoJson = topojson.feature(somTopo, somTopo.objects.som);

                // Add Somaliland
                const somaliland = {name: {common: 'Somaliland'}, cca3: 'SOL'};
                const solInfo = this.getRegionMapAndGeoJson(somaliland);
                const solFeature = solInfo.regionGeoJson.features[0];
                somGeoJson.features.push(solFeature);

                somTopo = topojson.topology([somGeoJson]);
                somTopo = this.setObjectIso(somTopo, iso);
            }
            countryTopo = somTopo;
        }

        // Exception: Cyprus
        // Territories: Northern Cyprus, Dhekelia, Akrotiri (merge with Cyprus)
        else if (iso == 'cyp') {
            CountryMap = require(`datamaps/dist/datamaps.cyp.min.js`);
            let cypTopo = Object.assign({}, CountryMap.prototype.cypTopo);
            if (cypTopo.objects.cyp.geometries.length > 1) { // If not already merged
                const cypGeoJson = topojson.feature(cypTopo, cypTopo.objects.cyp);

                // Add Northern Cyprus
                const northernCyprus = {name: {common: 'Northern Cyprus'}, cca3: 'CYN'};
                const cynInfo = this.getRegionMapAndGeoJson(northernCyprus);
                const cynFeature = cynInfo.regionGeoJson.features[0];
                cypGeoJson.features.push(cynFeature);

                // Add Dhekelia
                const dhekelia = {name: {common: 'Dhekelia'}, cca3: 'ESB'};
                const esbInfo = this.getRegionMapAndGeoJson(dhekelia);
                const esbFeature = esbInfo.regionGeoJson.features[0];
                cypGeoJson.features.push(esbFeature);

                // Add Akrotiri
                const akrotiri = {name: {common: 'Akrotiri'}, cca3: 'WSB'};
                const wsbInfo = this.getRegionMapAndGeoJson(akrotiri);
                const wsbFeature = wsbInfo.regionGeoJson.features[0];
                cypGeoJson.features.push(wsbFeature);

                cypTopo = topojson.topology([cypGeoJson]);
                cypTopo = this.setObjectIso(cypTopo, iso);
            }
            countryTopo = cypTopo;
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
        countryTopo = this.setObjectIso(countryTopo, iso);

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