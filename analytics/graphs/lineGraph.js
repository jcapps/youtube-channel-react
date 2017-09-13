import * as d3 from 'd3';
import computeVoronoi from '../helpers/computeVoronoi';

const svgWidth = 960;
const svgHeight = 400;
const svgMargin = {top: 10, right: 10, bottom: 50, left: 50};
const footnoteMargin = 15;
const width = svgWidth - svgMargin.left - svgMargin.right; // Does not include y-axis
const height = svgHeight - svgMargin.top - svgMargin.bottom; // Does not include x-axis
const xAxisLabelPadding = 60; // 60 = ~width in px of a date label with reasonable padding
const yAxisLabelPadding = 80; // reasonable minimum px separation between labels

// Parse the Date time
const parseTime = d3.timeParse('%Y-%m-%d');

// Format the time to be "d/m/yyyy"
const formatTime = d3.timeFormat('%x');

// Get the page position of the d3 element
const getD3ElementPosition = element => {
    return element.node().getBoundingClientRect();
};

// Create the scales in x and y directions
// Returns functions that scale the data
const createXYScales = () => {
    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    return {x, y};
};

// Prepares data for graphing
const prepareData = (dataInfo, xyInfo) => {
    const columns = dataInfo.columnHeaders.map(item => {
        return item.name;
    });
    const data = Object.assign([], dataInfo.rows);
    data.forEach((item, i) => {
        data[i] = d3.map(item, (d, i) => {
            return columns[i];
        });
        const dataEntry = data[i];
        dataEntry.set(xyInfo.xColumnName, parseTime(dataEntry.get(xyInfo.xColumnName)));
    });
    return data;
};

// Set the domains of the graph in x and y directions
const setXYDomains = (data, xyInfo) => {
    const xExtent = d3.extent(data, d => { return d.get(xyInfo.xColumnName); });
    let yMax = d3.max(data, d => { return d.get(xyInfo.yColumnName); });
    if (yMax < 1) yMax = 1;

    const xDomain = xExtent[1].getTime() - xExtent[0].getTime();
    const xDomainMargin = xDomain * .02;

    const maxYTicks = Math.min(yMax, Math.ceil(height / yAxisLabelPadding));

    xyInfo.x.domain([xExtent[0].getTime() - xDomainMargin, xExtent[1].getTime() + xDomainMargin]);
    xyInfo.y.domain([0, yMax]).nice(maxYTicks);
};

// Create containing svg
const createSvg = container => {
    return container.append('svg')
        .attr('id', 'lineGraph')
        .attr('width', svgWidth.toString())
        .attr('height', svgHeight.toString());
};

// Create group containing actual graph
const createGraphCanvas = () => {
    return d3.select('svg#lineGraph').append('g')
        .attr('id', 'graphCanvas')
        .attr('transform', 'translate(' + svgMargin.left + ',' + svgMargin.top + ')');
};

// Draws connecting line between two data points on graph
const drawLineBetweenPoints = xyInfo => {
    return d3.line()
        .x(d => { return xyInfo.x(d.get(xyInfo.xColumnName)); })
        .y(d => { return xyInfo.y(d.get(xyInfo.yColumnName)); });
};

// Creates a Tooltip for viewing data information on hover
const createTooltip = container => {
    return container.append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
};

// Draw Grid Lines
const drawGridLines = y => {
    const yDomain = y.domain();
    const maxTicks = Math.min(yDomain[1], Math.ceil(height / yAxisLabelPadding));

    d3.select('#graphCanvas').append('g')
        .attr('class', 'grid-line')
        .call(d3.axisLeft(y)
            .ticks(maxTicks)
            .tickSize(-width)
            .tickFormat(''));
};

// Draw X-Axis
const drawXAxis = (x, data) => {
    const maxTicks = Math.min(data.length, Math.floor(width / xAxisLabelPadding));
    const dayInterval = Math.ceil(data.length / maxTicks);
    const filterTicksToRender = d3.timeDay.filter(d => {
        return d3.timeDay.count(0, d) % dayInterval === 0;
    });

    d3.select('#graphCanvas').append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x)
            .ticks(filterTicksToRender)
            .tickFormat(formatTime));
};

// Draw Y-Axis
const drawYAxis = y => {
    const yDomain = y.domain();
    const maxTicks = Math.min(yDomain[1], Math.ceil(height / yAxisLabelPadding));
    
    d3.select('#graphCanvas').append('g')
        .attr('class', 'yAxis')
        .call(d3.axisLeft(y)
            .ticks(maxTicks)
            .tickFormat(d3.format('d')));
};

// Draw the path of the line graph
const drawLinePath = (data, drawLine) => {
    d3.select('#graphCanvas').append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', drawLine);
};

// Draw data points on the line path
const drawDataPoints = (data, xyInfo) => {
    d3.select('#graphCanvas').selectAll('circle.datum')
        .data(data)
        .enter()
        .append('circle')
            .attr('class', 'datum')
            .attr('r', 3)
            .attr('cx', d => { return xyInfo.x(d.get(xyInfo.xColumnName)); })
            .attr('cy', d => { return xyInfo.y(d.get(xyInfo.yColumnName)); });
};

// Draw a highlighted point to be used on data point hover
// Display set to "none" until needed
const drawHighlightedDataPoint = () => {
    const graphCanvas = d3.select('#graphCanvas');
    graphCanvas.append('circle')
        .attr('class', 'highlight-datum')
        .attr('r', 3)
        .style('display', 'none');

    graphCanvas.append('circle')
        .attr('class', 'highlight-datum-outline')
        .attr('r', 5)
        .style('display', 'none');
};

// Show highlighted data point, and set position over correct point
const showAndSetHighlightedDataPoint = (d, xyInfo) => {
    d3.select('.highlight-datum')
        .attr('cx', xyInfo.x(d.get(xyInfo.xColumnName)))
        .attr('cy', xyInfo.y(d.get(xyInfo.yColumnName)))
        .style('display', '');
    d3.select('.highlight-datum-outline')
        .attr('cx', xyInfo.x(d.get(xyInfo.xColumnName)))
        .attr('cy', xyInfo.y(d.get(xyInfo.yColumnName)))
        .style('display', '');
};

// Show tooltip with correct info, and set position over correct point
const showAndSetTooltip = (d, xyInfo) => {
    // Update tooltip with correct info to display
    const yLabel = xyInfo.yColumnName.charAt(0).toUpperCase() + xyInfo.yColumnName.slice(1);
    const yValue = d.get(xyInfo.yColumnName).toLocaleString();
    const tooltip = d3.select('.tooltip')
        .html(formatTime(d.get(xyInfo.xColumnName)) + '<br/>' + yLabel + ': ' + yValue)
        .style('white-space', 'nowrap')
        .style('display', ''); // Html must be created to calculate the size of the tooltip below

    // Gather positioning information
    const graphCanvas = d3.select('#graphCanvas');
    const gClientRect = getD3ElementPosition(graphCanvas);
    const top = gClientRect.top;
    const left = gClientRect.left;
    const tooltipSize = getD3ElementPosition(tooltip);
    const leftAxis = d3.select('.yAxis');
    const leftAxisWidth = getD3ElementPosition(leftAxis).width;

    // Set vertical and horizontal translations relative to page
    const verticalTranslate = top + document.body.scrollTop + xyInfo.y(d.get(xyInfo.yColumnName)) - tooltipSize.height;
    let horizontalTranslate = left + document.body.scrollLeft + xyInfo.x(d.get(xyInfo.xColumnName)) + leftAxisWidth;
    if (horizontalTranslate > left + document.body.scrollLeft + leftAxisWidth + width - tooltipSize.width) {
        horizontalTranslate = horizontalTranslate - tooltipSize.width;
    }

    // Set translations to tooltip
    tooltip.style('left', horizontalTranslate + 'px')
        .style('top', verticalTranslate + 'px');
};

// Hide highlighted data point
const hideHighlightedDataPoint = () => {
    d3.select('.highlight-datum')
        .style('display', 'none');
    d3.select('.highlight-datum-outline')
        .style('display', 'none');
};

// Hide tooltip
const hideTooltip = () => {
    d3.select('.tooltip')
        .style('display', 'none');
};

// Show/hide data points and tooltip
const highlight = (d, xyInfo) => {
    if (!d) {
        hideHighlightedDataPoint();
        hideTooltip();
    } else {
        showAndSetHighlightedDataPoint(d, xyInfo);
        showAndSetTooltip(d, xyInfo);
    }
};

// Overlays invisible canvas to handle hovering over data points
const prepareVoronoiCanvas = (voronoiDiagram, xyInfo) => {
    const graphCanvas = d3.select('#graphCanvas');

    const hoverHandler = () => {
        const [mx, my] = d3.mouse(graphCanvas.node());
        const site = voronoiDiagram.find(mx, my, 25);
        highlight(site && site.data, xyInfo);
    };  

    graphCanvas.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('opacity', 0)
        .on('mousemove', hoverHandler)
        .on('mouseleave', () => {
            highlight(null, xyInfo);
        });
};

// Create footnote for graph
const createGraphFootnote = () => {
    return d3.select('svg#lineGraph').append('text')
        .attr('id', 'graphFootnote')
        .attr('transform', 'translate(' + svgMargin.left + ',' + (svgHeight - footnoteMargin) + ')')
        .text('* Data from the past 48 hours may not yet be available.')
        .style('font-size', '10px')
        .style('font-style', 'italic');
}

// Create a line graph
const lineGraph = (container, dataInfo, xColumnName, yColumnName) => {
    const {x, y} = createXYScales();
    const xyInfo = {x, y, xColumnName, yColumnName};

    const data = prepareData(dataInfo, xyInfo);
    setXYDomains(data, xyInfo);

    createSvg(container);
    createGraphCanvas();
    drawGridLines(y);
    drawXAxis(x, data);
    drawYAxis(y);
    createTooltip(container);

    const drawLineFn = drawLineBetweenPoints(xyInfo);
    drawLinePath(data, drawLineFn);

    if (data.length < (width / 10)) { // if data points are closer than 10px apart, don't render points
        drawDataPoints(data, xyInfo);
    }
    drawHighlightedDataPoint();

    const voronoiDiagram = computeVoronoi(width, height, data, xyInfo);
    prepareVoronoiCanvas(voronoiDiagram, xyInfo);
    
    createGraphFootnote();
};

export default lineGraph;