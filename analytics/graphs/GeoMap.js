import WorldMap from 'datamaps/dist/datamaps.all.hires.min.js';
import * as D3 from 'd3';
import * as topojson from 'topojson';
import $ from 'jquery';
import DataTypes from '../globals/DataTypes';
import convertStateCodes from '../helpers/convertStateCodes';
import retrieveCountryInfo from '../helpers/retrieveCountryInfo';
import ManipulateGeoMap from './ManipulateGeoMap';

class GeoMap {
    constructor() {
        this.metricInfo;
        this.scope;
        this.height;
        this.width;
        this.maxValue;
        this.defaultRegionColor = 'lightgray';
        this.filledRegionColor = 'green';
        this.highlightColor = 'red';
        this.highlightBorderColor = 'rgba(250, 0, 50, 0.2)';
    }

    // Get the page position of the d3 element
    getD3ElementPosition(element) {
        return element.node().getBoundingClientRect();
    }

    // Prepare data for map
    prepareData(dataInfo, dataArea, isUsa) {
        let metric = this.metricInfo.metric;
        if (!metric) metric = this.metricInfo.name;
        
        const columns = dataInfo.columnHeaders.map(item => {
            return item.name;
        });
        const countryColumnIndex = columns.indexOf(dataArea);
        const metricColumnIndex = columns.indexOf(metric);

        let data = {};
        if (!dataInfo.rows) return data;
        dataInfo.rows.forEach((item, i) => {
            let iso;
            if (isUsa) {
                iso = convertStateCodes(item[countryColumnIndex]);
            } else {
                iso = retrieveCountryInfo(item[countryColumnIndex]).cca3;
            }
            const value = item[metricColumnIndex];
            let colorValue = value;
            if (value < 0) colorValue = 0;

            if (i == 0) this.maxValue = value;
            const colorScale = D3.scaleLinear()
                .domain([0, this.maxValue])
                .range([this.defaultRegionColor, this.filledRegionColor]);
            
            data[iso] = {value: value, fillColor: colorScale(colorValue)};
        });
        return data;
    }

    // Calculate time from minutes
    displayTimeNicely(totalTimeInMinutes) {
        let value = '';

        const days = Math.floor(totalTimeInMinutes / (60 * 24));
        const hours = Math.floor((totalTimeInMinutes - (days * 24 * 60)) / 60);
        const minutes = Math.floor(totalTimeInMinutes - (days * 24 * 60) - (hours * 60));
        const seconds = Math.round((totalTimeInMinutes - (days * 24 * 60) - (hours * 60) - minutes) * 60);

        if (days > 0 && days != 1) value += days + ' days ';
        if (days == 1) value += days + ' day ';
        if (hours > 0 && hours != 1) value += hours + ' hours ';
        if (hours == 1) value += hours + ' hour ';
        if (minutes > 0 && minutes != 1) value += minutes + ' minutes ';
        if (minutes == 1) value += minutes + ' minute ';
        if (seconds > 0 && seconds != 1) value += seconds + ' seconds ';
        if (seconds == 1) value += seconds + ' second ';
        return value.trim();
    };

    // Prepare tooltip value for display
    prepareTooltipValue(d) {
        let displayValue = d.value.toLocaleString();

        if (this.metricInfo.dataType == DataTypes.TIME_MINUTES) {
            displayValue = Math.round(d.value).toLocaleString();
            const displayTime = this.displayTimeNicely(d.value);
            if (displayTime.length > 0) displayValue += ' (' + displayTime + ')';
        }
        if (this.metricInfo.dataType == DataTypes.TIME_SECONDS) {
            displayValue = '0 seconds';
            const displayTime = this.displayTimeNicely(d.value / 60); // Divide by 60 to put time in minutes
            if (displayTime.length > 0) displayValue = displayTime;
        }
        if (this.metricInfo.dataType == DataTypes.PERCENTAGE) {
            displayValue = d.value.toFixed(1).toLocaleString() + '%';
        }
        if (this.metricInfo.dataType == DataTypes.RATIO) {
            displayValue = (d.value * 100).toFixed(2).toLocaleString() + '%';
        }
        if (this.metricInfo.dataType == DataTypes.DECIMAL) {
            displayValue = d.value.toFixed(2).toLocaleString();
        }
        if (this.metricInfo.dataType == DataTypes.CURRENCY) {
            displayValue = '$' + d.value.toFixed(2).toLocaleString();
        }

        return displayValue;
    }

    // Draw the map
    drawMap(container, dataInfo, metricInfo, dataArea, region) {
        this.metricInfo = metricInfo;
        if (dataArea == 'country') {
            this.scope = 'world';
            this.height = 650;
            this.width = 960;
        }
        if (dataArea == 'province') {
            this.scope = 'usa';
            this.height = 480;
            this.width = 960;
        }

        const zoomMin = this.width / 2 / Math.PI;
        const zoomMax = 300000;
        let Datamap = WorldMap;
        let latlng = [0, 0];
        let zoom = zoomMin;
        if (region.name.common != 'World' && region.cca3 != 'USA') {
            const GeoMapHelper = new ManipulateGeoMap;
            let iso = region.cca3.toLowerCase();
            let {CountryMap, countryData} = GeoMapHelper.getCountryMap(iso);
            
            if (countryData.objects[iso].geometries.length > 1) {
                countryData = GeoMapHelper.prepareCountryData(countryData, iso);
                CountryMap.prototype[iso + 'Topo'] = countryData;
            }
            const countryObjects = countryData.objects[iso];
            const geoJson = topojson.feature(countryData, countryObjects);
            Datamap = CountryMap;
            this.scope = iso;

            const {position, scale} = GeoMapHelper.getPositionAndScale(geoJson);
            latlng = position;
            zoom = scale;
            if (zoom < zoomMin) zoom = zoomMin;
            if (zoom > zoomMax) zoom = zoomMax;
        }

        let data = {};
        let setProjection = null;
        let projection = 'mercator';
        if (this.scope == 'usa') {
            data = this.prepareData(dataInfo, dataArea, true);
        } else {
            data = this.prepareData(dataInfo, dataArea, false);
            if (region.name.common != 'World') {
                projection = null;
                setProjection = (element) => {
                    const svg = d3.select(element).select('svg');
                    const proj = D3.geoMercator()
                        .center(latlng)
                        .scale(zoom)
                        .translate([this.getD3ElementPosition(svg).width / 2, this.getD3ElementPosition(svg).height / 2]);
                    const path = D3.geoPath()
                        .projection(proj);
                    return {path: path, projection: proj};
                }
            }
        }

        if ($.isEmptyObject(data)) {
            D3.select(container).append('div')
                .attr('class', 'error-message')
                .style('margin-bottom', '5px')
                .text('No data found for this time period and filter');
        }

        const map = new Datamap({
            element: container,
            scope: this.scope,
            projection: projection,
            setProjection: setProjection,
            height: this.height,
            width: this.width,
            fills: {
                defaultFill: this.defaultRegionColor
            },
            data: data,
            geographyConfig: {
                hideAntarctica: false,
                highlightFillColor: this.highlightColor,
                highlightBorderColor: this.highlightBorderColor,
                popupTemplate: (geo, d) => {
                    if (!d) return;

                    const tooltipValue = this.prepareTooltipValue(d);
                    let regionName = geo.properties.name;
                    if (this.scope != 'usa') {
                        const geoRegion = retrieveCountryInfo(geo.properties.iso);
                        regionName = geoRegion.name.common;
                    }

                    return [
                        '<div class="tooltip geo-tooltip">',
                        '<div>', regionName, '</div>',
                        '<div>', this.metricInfo.displayName, ': ', tooltipValue, '</div>',
                        '</div>' 
                    ].join('');
                }
            },
            done: (datamap) => {
                datamap.svg.selectAll('.datamaps-subunit').on('click', geography => {
                    console.log(geography.properties);
                });
            }
        });

        // Color the background (oceans) blue and add a brown border around map
        map.svg.style('background-color', 'steelblue')
            .style('margin', '5px')
            .style('outline', 'brown solid 5px ');

        // Overwrite the Datamap prototype function "updatePopup" with 
        // customized popup set and display
        map.updatePopup = (element, d, options) => {
            element.on('mousemove', null);
            element.on('mousemove', () => {
                const tooltipContainer = D3.select(map.svg.node().parentNode).select('.datamaps-hoverover')
                    .html(() => {
                        const data = JSON.parse(element.attr('data-info'));
                        try {
                            return options.popupTemplate(d, data);
                        } catch (e) {
                            return '';
                        }
                    })
                    .style('display', 'block'); // Html must be created to calculate the size of the tooltip below
                const tooltip = tooltipContainer.select('.tooltip')
                    .style('white-space', 'nowrap'); // Html must be formatted correctly to calculate the size of the tooltip below

                if (tooltip.node()) { // Places with 0 data don't show tooltip on hover
                    const mousePosition = d3.mouse(map.svg.node()); // Using the global d3 version used by datamaps module. This avoids overwriting the event listener.
                    const mapClientRect = this.getD3ElementPosition(map.svg);
                    const tooltipClientRect = this.getD3ElementPosition(tooltip);

                    const verticalTranslate = mapClientRect.top + mousePosition[1] - tooltipClientRect.height - 3; // 3 = Additional upward padding
                    let horizontalTranslate = mapClientRect.left + mousePosition[0];
                    if (horizontalTranslate > mapClientRect.right - tooltipClientRect.width) {
                        horizontalTranslate = horizontalTranslate - tooltipClientRect.width;
                    }
                
                    tooltipContainer.style('position', 'fixed')
                        .style('left', horizontalTranslate + 'px')
                        .style('top', verticalTranslate + 'px')
                }
            });
        };
    }
}

export default GeoMap;