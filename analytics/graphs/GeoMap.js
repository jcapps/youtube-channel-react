import Datamap from 'datamaps/dist/datamaps.all.hires.js';
import * as D3 from 'd3';
import convertCountryCodes from '../helpers/convertCountryCodes';

class GeoMap {
    constructor() {
        this.maxValue;
        this.defaultCountryColor = 'lightgray';
        this.filledCountryColor = 'green';
        this.highlightColor = 'red';
        this.highlightBorderColor = 'rgba(250, 0, 50, 0.2)';
    }

    // Get the page position of the d3 element
    getD3ElementPosition(element) {
        return element.node().getBoundingClientRect();
    }

    // Prepare data for map
    prepareData(dataInfo, metricInfo, dataArea) {
        const columns = dataInfo.columnHeaders.map(item => {
            return item.name;
        });
        const countryColumnIndex = columns.indexOf(dataArea);
        const metricColumnIndex = columns.indexOf(metricInfo.metric);

        let data = {};
        dataInfo.rows.forEach((item, i) => {
            const iso = convertCountryCodes(item[countryColumnIndex]);
            const value = item[metricColumnIndex];

            if (i == 0) this.maxValue = value;
            const colorScale = D3.scaleLinear()
                .domain([0, this.maxValue])
                .range([this.defaultCountryColor, this.filledCountryColor]);
            
            data[iso] = {value: value, fillColor: colorScale(value)};
        });
        return data;
    }

    // Draw the map
    drawMap(container, dataInfo, metricInfo, dataArea) {
        const data = this.prepareData(dataInfo, metricInfo, dataArea);

        let scope;
        if (dataArea == 'country') scope = 'world';
        if (dataArea == 'province') scope = 'usa';

        const map = new Datamap({
            element: container,
            scope: scope,
            projection: 'mercator',
            height: 650,
            width: 960,
            fills: {
                defaultFill: this.defaultCountryColor
            },
            data: data,
            geographyConfig: {
                highlightFillColor: this.highlightColor,
                highlightBorderColor: this.highlightBorderColor,
                popupTemplate: (geo, d) => {
                    if (!d) return;
                    return [
                        '<div class="tooltip geo-tooltip">',
                        '<div>', geo.properties.name, '</div>',
                        '<div>', metricInfo.displayName, ': ', d.value.toLocaleString(), '</div>',
                        '</div>' 
                    ].join('');
                }
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