import $ from 'jquery';
import retrieveCountryInfo from '../helpers/retrieveCountryInfo';

class ManipulateGeoMap {
    // Remove arc from arcArray
    removeArcFromArray(arc, arcArray) {
        const removeIndex = arcArray.findIndex(item => {
            return item.edgeArc == arc.edgeArc;
        });
        arcArray.splice(removeIndex, 1);
    }

    // Get the height, width, max/min longitude, max/min latitude
    getRegionBoundingBox(features) {
        let coordinatesArray = [];
        let height = null;
        let width = null;
        let minLong = null;
        let maxLong = null;
        let minLat = null;
        let maxLat = null;

        features.forEach(feature => {
            const geometry = feature.geometry;
            if (geometry.type == 'Polygon') {
                coordinatesArray = geometry.coordinates[0];
                if (!minLong) minLong = coordinatesArray[0][0];
                if (!maxLong) maxLong = coordinatesArray[0][0];
                if (!minLat) minLat = coordinatesArray[0][1];
                if (!maxLat) maxLat = coordinatesArray[0][1];
        
                coordinatesArray.forEach(coordinate => {
                    if (coordinate[0] < minLong) minLong = coordinate[0];
                    if (coordinate[0] > maxLong) maxLong = coordinate[0];
                    if (coordinate[1] < minLat) minLat = coordinate[1];
                    if (coordinate[1] > maxLat) maxLat = coordinate[1];
                });
            }
            if (geometry.type == 'MultiPolygon') {
                coordinatesArray = geometry.coordinates[0];
                if (!minLong) minLong = coordinatesArray[0][0][0];
                if (!maxLong) maxLong = coordinatesArray[0][0][0];
                if (!minLat) minLat = coordinatesArray[0][0][1];
                if (!maxLat) maxLat = coordinatesArray[0][0][1];

                geometry.coordinates.forEach(arrayOfCoordinates => {
                    arrayOfCoordinates.forEach(nextArray => {
                        coordinatesArray = nextArray;
                
                        coordinatesArray.forEach(coordinate => {
                            if (coordinate[0] < minLong) minLong = coordinate[0];
                            if (coordinate[0] > maxLong) maxLong = coordinate[0];
                            if (coordinate[1] < minLat) minLat = coordinate[1];
                            if (coordinate[1] > maxLat) maxLat = coordinate[1];
                        });
                    });
                });
            } 
        });

        height = maxLat - minLat;
        width = maxLong - minLong;

        return {height, width, minLong, maxLong, minLat, maxLat};
    }

    // Get latitude/longitude and scale of country given country's GeoJson
    getPositionAndScale(geoJson) {
        const regionSize = this.getRegionBoundingBox(geoJson.features);

        // Position
        const longitude = regionSize.maxLong - (regionSize.width / 2);
        const latitude = regionSize.maxLat - (regionSize.height / 2);
        const middleScale = ((1 / Math.cos(regionSize.minLat * (Math.PI / 180))) + (1 / Math.cos(regionSize.maxLat * (Math.PI / 180)))) / 2;
        const scaledLatitude = Math.acos(1 / middleScale) * (180 / Math.PI) * (latitude / Math.abs(latitude));
        const scaledCenterLatitude = (latitude + scaledLatitude) / 2
        const position = [longitude, scaledCenterLatitude];

        // Scale
        const scaleMin = this.width / 2 / Math.PI;
        const scaleMax = 300000;
        let scale = scaleMin;
        if ((regionSize.width / regionSize.height) < 2) { // 2 = 360 / 180 (total degrees of longitude / total degrees of latitude)
            scale = 20000 / ((1 + (Math.pow(middleScale, 5) * 0.01)) * regionSize.height);
        } else {
            scale = 40000 / ((1 + (middleScale * 0.2)) * regionSize.width);
        }
        if (scale < scaleMin) scale = scaleMin;
        if (scale > scaleMax) scale = scaleMax;

        return {position, scale};
    }
    
    // Handle cases where two edge boundaries and 2+ inner boundaries meet
    patchCornerConnections(currentArc, edgeArcs, allArcs) {
        let nextArc = currentArc;
        let index = edgeArcs.findIndex(item => {
            return item.edgeArc == nextArc.rightArc;
        });

        while (index < 0) {
            nextArc = allArcs.find(arc => {
                return nextArc.rightArc == ~arc.edgeArc;
            });
            index = edgeArcs.findIndex(item => {
                return item.edgeArc == nextArc.rightArc;
            });
        }

        return edgeArcs[index];
    }

    // Compare arcs to see if share boundary
    compareArcs(compareArc, arcs) {
        for (let arcsArray of arcs) {
            for (let arc of arcsArray) {
                if (compareArc == ~arc) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if arc is written twice (boundary is shared by two regions)
    arcSharesBoundary(geometries, compareArc, geometryType) {
        for (let geometry of geometries) {
            if (geometry.type == 'Polygon') {
                if (this.compareArcs(compareArc, geometry.arcs)) return true;
            }
            if (geometry.type == 'MultiPolygon') {
                for (let multiArcArray of geometry.arcs) {
                    if (this.compareArcs(compareArc, multiArcArray)) return true;
                }
            }
        }
        return false;
    }

    // Sort arcs into clockwise order
    sortArcs(edgeArcs, allArcs) {
        const arcsInNeedOfSorting = [];
        edgeArcs.forEach(arc => {
            arcsInNeedOfSorting.push(Object.assign({}, arc));
        });

        const sortedArcs = [];
        while (arcsInNeedOfSorting.length > 0) {
            sortedArcs.push([]);
            let currentSortedArcs = sortedArcs[sortedArcs.length - 1];
            let currentArc = arcsInNeedOfSorting[0];
            currentSortedArcs.push(currentArc.edgeArc);
            this.removeArcFromArray(currentArc, arcsInNeedOfSorting);

            const targetLeftArc = currentArc.leftArc;
            while (
                currentArc.rightArc != null && 
                currentArc.rightArc != ~targetLeftArc
            ) {
                let arcFound = false;
                for (let arc of arcsInNeedOfSorting) {
                    if (currentArc.rightArc == ~arc.leftArc) {
                        currentSortedArcs.push(arc.edgeArc);
                        this.removeArcFromArray(arc, arcsInNeedOfSorting);
                        currentArc = arc;
                        arcFound = true;
                        break;
                    }
                }

                if (!arcFound) {
                    const nextArc = this.patchCornerConnections(currentArc, edgeArcs, allArcs);
                    currentSortedArcs.push(nextArc.edgeArc);
                    this.removeArcFromArray(nextArc, arcsInNeedOfSorting);
                    currentArc = nextArc;
                }
            }
        }

        return sortedArcs;
    }

    // Gather arc information and prepare for sorting
    prepareArcArraysForSorting(arcsArray, edgeArcs, allArcs, geometries) {
        arcsArray.forEach((arc, i) => {
            const edgeArc = arc;
            let leftArc = null;
            let rightArc = null;

            if (arcsArray.length == 2) {
                if (i == 0) {
                    leftArc = arcsArray[1];
                    rightArc = arcsArray[1];
                }
                if (i == 1) {
                    leftArc = arcsArray[0];
                    rightArc = arcsArray[0];
                }
            }
            if (arcsArray.length > 2) {
                if (i == 0) {
                    leftArc = arcsArray[arcsArray.length - 1];
                    rightArc = arcsArray[i + 1];
                }
                if (i == arcsArray.length - 1) {
                    leftArc = arcsArray[i - 1];
                    rightArc = arcsArray[0];
                }
                if (i > 0 && i < arcsArray.length - 1) {
                    leftArc = arcsArray[i - 1];
                    rightArc = arcsArray[i + 1];
                }
            }

            allArcs.push({edgeArc, leftArc, rightArc});
            if (!this.arcSharesBoundary(geometries, arc)) {
                edgeArcs.push({edgeArc, leftArc, rightArc});
            }
        });
    }

    // Remove provinces/counties within countries
    prepareCountryData(countryData, iso) {
        // Make deep object copies so don't overwrite original data
        const topojson = Object.assign({}, countryData);
        topojson.objects = Object.assign({}, countryData.objects);
        topojson.objects[iso] = Object.assign({}, countryData.objects[iso]);
        topojson.objects[iso].geometries = Object.assign([], countryData.objects[iso].geometries);

        const newGeometry = {
            type: 'Polygon',
            properties: {name: retrieveCountryInfo(iso).name.common, iso: iso.toUpperCase()},
            id: iso.toUpperCase(),
            arcs: []
        };
        
        const allArcs = [];
        const edgeArcs = [];
        const geometries = topojson.objects[iso].geometries;
        geometries.forEach(geometry => {
            if (geometry.type == 'Polygon') {
                geometry.arcs.forEach(arcsArray => {
                    this.prepareArcArraysForSorting(arcsArray, edgeArcs, allArcs, geometries);
                });
            }
            if (geometry.type == 'MultiPolygon') {
                geometry.arcs.forEach(multiArcArray => {
                    multiArcArray.forEach(arcsArray => {
                        this.prepareArcArraysForSorting(arcsArray, edgeArcs, allArcs, geometries);
                    });
                });
            }
        });

        if (iso == 'kaz') {
            const removeIndex = edgeArcs.findIndex(item => {
                return item.edgeArc == 17; // Remove Baikonur from Kazakhstan
            });
            edgeArcs.splice(removeIndex, 1);
        }
        const sortedArcs = this.sortArcs(edgeArcs, allArcs);
        if (sortedArcs.length > 1) {
            newGeometry.type = 'MultiPolygon';
            newGeometry.arcs = [sortedArcs];
        } else {
            newGeometry.arcs = sortedArcs;
        }

        topojson.objects[iso].geometries = [newGeometry];
        return topojson;
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
        let countryData = JSON.parse(JSON.stringify(CountryMap.prototype[isoCountry + 'Topo']));
        let geometries = countryData.objects[isoCountry].geometries;
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

        countryData.objects[isoCountry].geometries = geometries;
        CountryMap.prototype[isoTerritory + 'Topo'] = countryData;

        // Remove territory from country's topojson
        countryData = CountryMap.prototype[isoCountry + 'Topo'];
        geometries = countryData.objects[isoCountry].geometries;
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
        
        countryData.objects[isoCountry].geometries = geometries;
        CountryMap.prototype[isoCountry + 'Topo'] = countryData;
    }

    // Get a country's map and topojson data. Handle exceptions.
    getCountryMap(iso) {
        iso = iso.toLowerCase();
        let CountryMap;
        let countryData;

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
            countryData = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
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
            countryData = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }
        
        // Exception: Netherlands
        // Territories: Bonaire, Sint Eustatius, and Saba (Caribbean Netherlands)
        else if (iso == 'nld' || iso == 'bes') {
            CountryMap = require(`datamaps/dist/datamaps.nld.min.js`);
            const besTopo = Object.assign({}, CountryMap.prototype.besTopo);
            if ($.isEmptyObject(besTopo)) {
                this.createMissingTopojson(CountryMap, 'bes', 'nld');
            }
            countryData = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
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
            countryData = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }
        
        // Exception: New Zealand
        // Territories: Tokelau
        else if (iso == 'nzl' || iso == 'tkl') {
            CountryMap = require(`datamaps/dist/datamaps.nzl.min.js`);
            const tlkTopo = Object.assign({}, CountryMap.prototype.tklTopo);
            if ($.isEmptyObject(tlkTopo)) {
                this.createMissingTopojson(CountryMap, 'tkl', 'nzl');
            }
            countryData = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
        }

        // Everything else
        else {
            if (iso == 'ala') iso = 'ald'; // Adjust for difference in datamaps library
            if (iso == 'pse') iso = 'psx'; // Adjust for difference in datamaps library
            if (iso == 'esh') iso = 'sah'; // Adjust for difference in datamaps library
            if (iso == 'ssd') iso = 'sds'; // Adjust for difference in datamaps library
            if (iso == 'unk') iso = 'kos'; // Adjust for difference in datamaps library
            CountryMap = require(`datamaps/dist/datamaps.${iso}.min.js`);
            countryData = Object.assign({}, CountryMap.prototype[iso + 'Topo']);
            if (iso == 'ald') iso = 'ala'; // Adjust for difference in datamaps library
            if (iso == 'psx') iso = 'pse'; // Adjust for difference in datamaps library
            if (iso == 'sah') iso = 'esh'; // Adjust for difference in datamaps library
            if (iso == 'sds') iso = 'ssd'; // Adjust for difference in datamaps library
            if (iso == 'kos') iso = 'unk'; // Adjust for difference in datamaps library
        }
        const objectIso = Object.keys(countryData.objects)[0];
        if (objectIso != iso) {
            Object.defineProperty(
                countryData.objects,
                iso,
                Object.getOwnPropertyDescriptor(countryData.objects, objectIso)
            );
            delete countryData.objects[objectIso];
        }

        return {CountryMap, countryData};
    }
}

export default ManipulateGeoMap;