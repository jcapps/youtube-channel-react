import * as d3 from 'd3';
import computeVoronoi from '../helpers/computeVoronoi';

let graphSize;
let graphContainer;
let svgWidth;
let svgHeight;
let svgMargin;
let width;
let height;
let xAxisLabelPadding;
let yAxisLabelPadding;
const footnoteMargin = 15;

// Parse the Date time
const parseTime = d3.timeParse('%Y-%m-%d');

// Format the time to be "d/m/yyyy"
const formatTime = d3.timeFormat('%x');

// Get the page position of the d3 element
const getD3ElementPosition = element => {
    return element.node().getBoundingClientRect();
};

// Configure graph size, margin, and padding
const setSizeConstants = () => {
    if (graphSize == 'large') {
        svgWidth = 960;
        svgHeight = 400;
        svgMargin = {top: 10, right: 10, bottom: 50, left: 50};
        xAxisLabelPadding = 60; // 60 = ~width in px of a date label with reasonable padding
        yAxisLabelPadding = 80; // reasonable minimum px separation between labels
    }
    if (graphSize == 'medium') {
        svgWidth = 260;
        svgHeight = 100;
        svgMargin = {top: 10, right: 10, bottom: 10, left: 10};
        xAxisLabelPadding = 0;
        yAxisLabelPadding = 0;
    }
    if (graphSize == 'small') {
        svgWidth = 120;
        svgHeight = 60;
        svgMargin = {top: 10, right: 10, bottom: 10, left: 10};
        xAxisLabelPadding = 0;
        yAxisLabelPadding = 0;
    }
    width = svgWidth - svgMargin.left - svgMargin.right; // Does not include y-axis
    height = svgHeight - svgMargin.top - svgMargin.bottom; // Does not include x-axis
}

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

    let yMin = d3.min(data, d => { return d.get(xyInfo.yColumnName); });
    if (yMin > 0) yMin = 0;
    let yMax = d3.max(data, d => { return d.get(xyInfo.yColumnName); });
    if (yMax < 1) yMax = 1;

    const xDomain = xExtent[1].getTime() - xExtent[0].getTime();
    const xDomainMargin = xDomain * .02;

    const maxYTicks = Math.min(yMax, Math.ceil(height / yAxisLabelPadding));

    xyInfo.x.domain([xExtent[0].getTime() - xDomainMargin, xExtent[1].getTime() + xDomainMargin]);
    xyInfo.y.domain([yMin, yMax]).nice(maxYTicks);
};

// Create containing svg
const createSvg = () => {
    return graphContainer.append('svg')
        .attr('class', 'lineGraph')
        .attr('width', svgWidth.toString())
        .attr('height', svgHeight.toString());
};

// Create group containing actual graph
const createGraphCanvas = () => {
    return graphContainer.select('svg.lineGraph').append('g')
        .attr('class', 'graphCanvas')
        .attr('transform', 'translate(' + svgMargin.left + ',' + svgMargin.top + ')');
};

// Draws connecting line between two data points on graph
const drawLineBetweenPoints = xyInfo => {
    return d3.line()
        .x(d => { return xyInfo.x(d.get(xyInfo.xColumnName)); })
        .y(d => { return xyInfo.y(d.get(xyInfo.yColumnName)); });
};

// Creates a Tooltip for viewing data information on hover
const createTooltip = () => {
    return graphContainer.append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
};

// Draw Grid Lines
const drawGridLines = y => {
    const yDomain = y.domain();
    const maxTicks = Math.min(yDomain[1], Math.ceil(height / yAxisLabelPadding));

    graphContainer.select('.graphCanvas').append('g')
        .attr('class', 'grid-line')
        .call(d3.axisLeft(y)
            .ticks(maxTicks)
            .tickSize(-width)
            .tickFormat(''))
        .select('path').remove();
};

// Draw Baseline
const drawBaseline = y => {
    graphContainer.select('.graphCanvas').append('g')
        .attr('class', 'grid-baseline')
        .call(d3.axisLeft(y)
            .tickValues([0])
            .tickSize(-width)
            .tickFormat(''))
        .select('path').remove();
};

// Draw X-Axis
const drawXAxis = (x, data) => {
    const maxTicks = Math.min(data.length, Math.floor(width / xAxisLabelPadding));
    const dayInterval = Math.ceil(data.length / maxTicks);
    const filterTicksToRender = d3.timeDay.filter(d => {
        return d3.timeDay.count(0, d) % dayInterval === 0;
    });

    graphContainer.select('.graphCanvas').append('g')
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
    
    graphContainer.select('.graphCanvas').append('g')
        .attr('class', 'yAxis')
        .call(d3.axisLeft(y)
            .ticks(maxTicks)
            .tickFormat(d3.format('d')));
};

// Draw the path of the line graph
const drawLinePath = (data, drawLine) => {
    graphContainer.select('.graphCanvas').append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', drawLine);
};

// Draw data points on the line path
const drawDataPoints = (data, xyInfo) => {
    graphContainer.select('.graphCanvas').selectAll('circle.datum')
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
    const graphCanvas = graphContainer.select('.graphCanvas');
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
const showAndSetHighlightedDataPoint = (d, xyInfo, container) => {
    container.select('.highlight-datum')
        .attr('cx', xyInfo.x(d.get(xyInfo.xColumnName)))
        .attr('cy', xyInfo.y(d.get(xyInfo.yColumnName)))
        .style('display', '');
    container.select('.highlight-datum-outline')
        .attr('cx', xyInfo.x(d.get(xyInfo.xColumnName)))
        .attr('cy', xyInfo.y(d.get(xyInfo.yColumnName)))
        .style('display', '');
};

// Calculate time from minutes
const displayTimeNicely = totalTimeInMinutes => {
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

// Show tooltip with correct info, and set position over correct point
const showAndSetTooltip = (d, xyInfo, container) => {
    // Update tooltip with correct info to display
    let yLabel = xyInfo.yColumnName;
    yLabel = yLabel.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
    yLabel = yLabel.charAt(0).toUpperCase() + yLabel.slice(1); // Capitalize first letter

    let yValue = d.get(xyInfo.yColumnName).toLocaleString();

    if (xyInfo.yColumnName == 'watchTime') {
        yLabel += ' (minutes)';
        yValue = Math.round(d.get(xyInfo.yColumnName)).toLocaleString();
        const displayTime = displayTimeNicely(d.get(xyInfo.yColumnName));
        if (displayTime.length > 0) yValue += ' (' + displayTime + ')';
    }

    let tooltipHtml = formatTime(d.get(xyInfo.xColumnName)) + '<br/>' + yLabel + ': ' + yValue;
    if (yLabel.length + yValue.length > 25)
        tooltipHtml = formatTime(d.get(xyInfo.xColumnName)) + '<br/>' + yLabel + ':<br/>' + yValue;

    const tooltip = container.select('.tooltip')
        .html(tooltipHtml)
        .style('white-space', 'nowrap')
        .style('display', ''); // Html must be created to calculate the size of the tooltip below

    // Gather positioning information
    const lineGraph = container.select('svg.lineGraph');
    const gContainerClientRect = getD3ElementPosition(container);
    const gGraphClientRect = getD3ElementPosition(lineGraph);
    const top = gGraphClientRect.top - gContainerClientRect.top + svgMargin.top - 7; // 7 = Additional upward padding
    const left = gGraphClientRect.left - gContainerClientRect.left + svgMargin.left;
    const tooltipSize = getD3ElementPosition(tooltip);

    // Set vertical and horizontal translations relative to container
    const verticalTranslate = top + xyInfo.y(d.get(xyInfo.yColumnName)) - tooltipSize.height;
    let horizontalTranslate = left + xyInfo.x(d.get(xyInfo.xColumnName));
    if (horizontalTranslate > left + width - tooltipSize.width) {
        horizontalTranslate = horizontalTranslate - tooltipSize.width;
    }

    // Set translations to tooltip
    tooltip.style('position', 'absolute')
        .style('left', horizontalTranslate + 'px')
        .style('top', verticalTranslate + 'px');
};

// Show condensed tooltip with correct info, and set position over correct point
const showAndSetSmallerTooltip = (d, xyInfo, container) => {
    // Update tooltip with correct info to display
    let yValue = d.get(xyInfo.yColumnName).toLocaleString();

    if (xyInfo.yColumnName == 'watchTime') {
        const displayTime = displayTimeNicely(d.get(xyInfo.yColumnName));
        if (displayTime.length > 0) yValue = displayTime;
    }
    
    const tooltip = container.select('.tooltip')
        .html(yValue)
        .style('white-space', 'nowrap')
        .style('display', ''); // Html must be created to calculate the size of the tooltip below

    // Gather positioning information
    const lineGraph = container.select('svg.lineGraph');
    const gContainerClientRect = getD3ElementPosition(container);
    const gGraphClientRect = getD3ElementPosition(lineGraph);
    const top = gGraphClientRect.top - gContainerClientRect.top + svgMargin.top - 7; // 7 = Additional upward padding
    const left = gGraphClientRect.left - gContainerClientRect.left + svgMargin.left;
    const tooltipSize = getD3ElementPosition(tooltip);

    // Set vertical and horizontal translations relative to container
    const verticalTranslate = top + xyInfo.y(d.get(xyInfo.yColumnName)) - tooltipSize.height;
    let horizontalTranslate = left + xyInfo.x(d.get(xyInfo.xColumnName));
    if (horizontalTranslate > left + width - tooltipSize.width) {
        horizontalTranslate = horizontalTranslate - tooltipSize.width;
    }

    // Set translations to tooltip
    tooltip.style('position', 'absolute')
        .style('left', horizontalTranslate + 'px')
        .style('top', verticalTranslate + 'px');
};

// Hide highlighted data point
const hideHighlightedDataPoint = container => {
    container.select('.highlight-datum')
        .style('display', 'none');
    container.select('.highlight-datum-outline')
        .style('display', 'none');
};

// Hide tooltip
const hideTooltip = container => {
    container.select('.tooltip')
        .style('display', 'none');
};

// Show/hide data points and tooltip
const highlight = (d, xyInfo, container) => {
    if (!d) {
        hideHighlightedDataPoint(container);
        hideTooltip(container);
    } else {
        showAndSetHighlightedDataPoint(d, xyInfo, container);
        if (graphSize == 'large') showAndSetTooltip(d, xyInfo, container);
        if (graphSize == 'medium') showAndSetSmallerTooltip(d, xyInfo, container);
    }
};

// Overlays invisible canvas to handle hovering over data points
const prepareVoronoiCanvas = (voronoiDiagram, xyInfo) => {
    const container = graphContainer; // Isolate the constant for this particular listener
    const graphCanvas = container.select('.graphCanvas');

    const hoverHandler = () => {
        const [mx, my] = d3.mouse(graphCanvas.node());
        const site = voronoiDiagram.find(mx, my, 25);
        highlight(site && site.data, xyInfo, container);
    };  

    graphCanvas.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('opacity', 0)
        .on('mousemove', hoverHandler)
        .on('mouseleave', () => {
            highlight(null, xyInfo, container);
        });
};

const prepareXValueHover = (data, xyInfo) => {
    const container = graphContainer; // Isolate the constant for this particular listener
    const graphCanvas = container.select('.graphCanvas');

    const bisector = d3.bisector(d => { return d.get(xyInfo.xColumnName); }).left;
    
    const hoverHandler = () => {
        const mx = xyInfo.x.invert(d3.mouse(graphCanvas.node())[0]);
        const dataIndex = bisector(data, mx, 1, data.length - 1);
        const leftDataPoint = data[dataIndex - 1];
        const rightDataPoint = data[dataIndex];
        const nearestDataPoint = (mx - leftDataPoint.get(xyInfo.xColumnName)) > (rightDataPoint.get(xyInfo.xColumnName) - mx)
            ? rightDataPoint
            : leftDataPoint;
        
        highlight(nearestDataPoint, xyInfo, container);
    };

    graphCanvas.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('opacity', 0)
        .on('mousemove', hoverHandler)
        .on('mouseleave', () => {
            highlight(null, xyInfo, container);
        });
};

// Create footnote for graph
const createGraphFootnote = () => {
    return graphContainer.select('svg.lineGraph').append('text')
        .attr('id', 'graphFootnote')
        .attr('transform', 'translate(' + svgMargin.left + ',' + (svgHeight - footnoteMargin) + ')')
        .text('* Data from the past 48 hours may not yet be available.')
        .style('font-size', '10px')
        .style('font-style', 'italic');
}

// Create a line graph
const lineGraph = (container, dataInfo, xColumnName, yColumnName, size = 'large') => {
    container.style('position', 'relative');
    graphSize = size;
    graphContainer = container;
    setSizeConstants();

    const {x, y} = createXYScales();
    const xyInfo = {x, y, xColumnName, yColumnName};

    const data = prepareData(dataInfo, xyInfo);
    setXYDomains(data, xyInfo);

    createSvg();
    createGraphCanvas();

    if (size == 'large') {
        drawGridLines(y);
        drawXAxis(x, data);
        drawYAxis(y);
    }
    drawBaseline(y);

    if (size == 'large' || size == 'medium') {
        createTooltip();
    }

    const drawLineFn = drawLineBetweenPoints(xyInfo);
    drawLinePath(data, drawLineFn);

    if (data.length < (width / 10)) { // if data points are closer than 10px apart, don't render points
        drawDataPoints(data, xyInfo);
    }

    if (size == 'medium') {
        drawHighlightedDataPoint();
        prepareXValueHover(data, xyInfo);
    }
    
    if (size == 'large') {
        drawHighlightedDataPoint();

        const voronoiDiagram = computeVoronoi(width, height, data, xyInfo);
        prepareVoronoiCanvas(voronoiDiagram, xyInfo);

        createGraphFootnote();
    }
};

export default lineGraph;