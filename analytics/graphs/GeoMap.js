import WorldMap from 'datamaps/dist/datamaps.all.hires.min.js';
import * as D3 from 'd3';
import $ from 'jquery';
import DataTypes from '../globals/DataTypes';
import addGraphFilter from '../helpers/addGraphFilter';
import convertStateCodes from '../helpers/convertStateCodes';
import retrieveCountryInfo from '../helpers/retrieveCountryInfo';
import ManipulateGeoMap from './ManipulateGeoMap';

class GeoMap {
    constructor() {
        this.metricInfo;
        this.filterState;
        this.setFilterState;
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

    // Filter by country
    addGeoFilter(geoFilter) {
        const {newFiltersArray, newAddedFiltersArray, newContentType}
            = addGraphFilter(geoFilter, this.filterState.contentType, this.filterState.filters, this.filterState.addedFilters);

        const {timePeriod, dateRange} = this.filterState;
        this.onChangeFilters({
            contentType: newContentType,
            timePeriod,
            dateRange,
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });
    }

    // Prepare data for map
    prepareData(dataInfo, dataArea, shouldShowStates) {
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
            if (shouldShowStates) {
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
    drawMap(
        container,
        dataInfo,
        metricInfo,
        dataArea,
        region,
        onChangeFilters,
        filterState
    ) {
        this.metricInfo = metricInfo;
        this.filterState = filterState;
        this.onChangeFilters = onChangeFilters;

        this.height = 650;
        this.width = 960;

        this.scope = 'world';
        if (dataArea == 'province') {
            this.scope = 'usa'; // Specifically, USA subdivided into states
        }

        let Datamap = WorldMap;
        let geoJson = null;
        const GeoMapHelper = new ManipulateGeoMap;
        if (this.scope != 'usa') {
            let regionInfo = GeoMapHelper.getRegionMapAndGeoJson(region);
            
            geoJson = regionInfo.regionGeoJson;
            Datamap = regionInfo.RegionMap;
            if (region.name.common != 'World') {
                this.scope = region.cca3.toLowerCase();
            }
        }

        let data = {};
        let path = null;
        let setProjection = null;
        let projection = 'mercator';
        const projectionMargin = 100;
        if (this.scope == 'usa') {
            let shouldShowStates = false;
            if (dataArea == 'province') shouldShowStates = true;
            data = this.prepareData(dataInfo, dataArea, shouldShowStates);
        } else {
            data = this.prepareData(dataInfo, dataArea, false);
            projection = D3.geoOrthographic();
            if (region.name.common == 'World') {
                projection.rotate([0, 0]);
            } else {
                projection.rotate([-region.latlng[1], -region.latlng[0]]);
            }
            projection.fitExtent(
                [
                    [projectionMargin, projectionMargin],
                    [this.width - projectionMargin, this.height - projectionMargin]
                ],
                geoJson
            );
            path = D3.geoPath().projection(projection);

            setProjection = () => {
                return {path: path, projection: projection};
            }
        }

        if (this.scope != 'usa' && region.name.common != 'World') {
            Datamap = GeoMapHelper.addSurroundingRegions(region, Datamap, geoJson, projection, this.width, this.height);
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
                    if (geo.properties.iso) {
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
                    let iso = geography.properties.iso;
                    if (
                        geography.properties.name == 'Northern Cyprus' ||
                        geography.properties.name == 'Akrotiri' ||
                        geography.properties.name == 'Dhekelia'
                    ) {
                        iso = 'CYP';
                    }
                    if (geography.properties.name == 'Somaliland') {
                        iso = 'SOM';
                    }
                    if (geography.properties.name == 'Kosovo') {
                        iso = 'UNK';
                    }
                    if (iso) {
                        this.addGeoFilter(retrieveCountryInfo(iso));
                    }
                });
            }
        });

        // If showing the globe (i.e. not USA map), add a blue circle behind map (oceans)
        if (this.scope != 'usa') {
            map.svg.insert('circle', ':first-child')
                .attr('cx', projection.translate()[0])
                .attr('cy', projection.translate()[1])
                .attr('r', projection.scale())
                .style('fill', 'steelblue')
                .style('stroke', 'white')
                .style('stroke-width', '1');
        }

        // Prepare background canvas for styling
        map.svg.attr('class', 'geo-canvas');

        // Overwrite the Datamap prototype function "updatePopup" with 
        // customized popup set and display
        const createCustomPopup = (element, d, options) => {
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
        map.updatePopup = createCustomPopup;
        
        // Get rotation around vertical axis
        const lambda = D3.scaleLinear()
            .domain([0, this.width])
            .range([-360, 360]);

        // Get rotation around horizontal axis
        const phi = D3.scaleLinear()
            .domain([0, this.height])
            .range([180, -180]);

        // Spin globe on drag
        if (this.scope == 'world') {
            map.svg.on('mousedown', downEvent => {
                let o = projection.rotate(); // Get the current origin (long/lat) of the map
                const p = d3.mouse(map.svg.node()); // Using the global d3 version used by datamaps module. This avoids overwriting the event listener.
                map.svg.on('mousemove', moveEvent => {
                    map.updatePopup = () => {};
                    const q = d3.mouse(map.svg.node()); // Using the global d3 version used by datamaps module. This avoids overwriting the event listener.
                    projection = D3.geoOrthographic()
                        .fitExtent(
                            [
                                [projectionMargin, projectionMargin],
                                [this.width - projectionMargin, this.height - projectionMargin]
                            ],
                            geoJson
                        )
                        .rotate([o[0] + ((q[0] - p[0]) / 2), o[1] + ((p[1] - q[1]) / 2)]);
                    const path = D3.geoPath()
                        .projection(projection);
                    map.svg.selectAll('path').attr('d', path);
                });
            });
            $(document).on('mouseup', upEvent => {
                map.svg.on('mousemove', null);
                map.updatePopup = createCustomPopup;
            });
        }
    }
}

export default GeoMap;