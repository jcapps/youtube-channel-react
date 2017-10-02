import * as d3 from 'd3';
import computeVoronoi from '../helpers/computeVoronoi';
import convertSecondsToTimestamp from '../helpers/convertSecondsToTimestamp';

class LineGraph {
    constructor() {
        this.isMoneyMetric;
        this.isTimeMetric;
        this.data;
        this.xyInfo;
        this.graphSize;
        this.graphContainer;
        this.svgWidth;
        this.svgHeight;
        this.svgMargin;
        this.width;
        this.height;
        this.xAxisLabelPadding;
        this.yAxisLabelPadding;
        this.footnoteMargin = 15;
    
        // Parse the Date time
        this.parseTime = d3.timeParse('%Y-%m-%d');
    
        // Format the time to be "d/m/yyyy"
        this.formatTime = d3.timeFormat('%x');
    };

    // Get the page position of the d3 element
    getD3ElementPosition(element) {
        return element.node().getBoundingClientRect();
    }

    // Configure graph size, margin, and padding
    setSizeConstants() {
        if (this.graphSize == 'large') {
            this.svgWidth = 960;
            this.svgHeight = 400;
            this.svgMargin = {top: 10, right: 10, bottom: 50, left: 50};
            this.xAxisLabelPadding = 60; // 60 = ~width in px of a date label with reasonable padding
            this.yAxisLabelPadding = 80; // reasonable minimum px separation between labels
        }
        if (this.graphSize == 'medium') {
            this.svgWidth = 260;
            this.svgHeight = 100;
            this.svgMargin = {top: 10, right: 10, bottom: 10, left: 10};
            this.xAxisLabelPadding = 0;
            this.yAxisLabelPadding = 0;
        }
        if (this.graphSize == 'small') {
            this.svgWidth = 120;
            this.svgHeight = 60;
            this.svgMargin = {top: 10, right: 10, bottom: 10, left: 10};
            this.xAxisLabelPadding = 0;
            this.yAxisLabelPadding = 0;
        }
        this.width = this.svgWidth - this.svgMargin.left - this.svgMargin.right; // Does not include y-axis
        this.height = this.svgHeight - this.svgMargin.top - this.svgMargin.bottom; // Does not include x-axis
    }

    // Create the scales in x and y directions
    // Returns functions that scale the data
    createXYScales() {
        const x = d3.scaleTime().rangeRound([0, this.width]);
        const y = d3.scaleLinear().rangeRound([this.height, 0]);
        return {x, y};
    };

    // Prepares data for graphing
    prepareData(dataInfo) {
        const columns = dataInfo.columnHeaders.map(item => {
            return item.name;
        });
        const data = Object.assign([], dataInfo.rows);
        data.forEach((item, i) => {
            data[i] = d3.map(item, (d, i) => {
                return columns[i];
            });
            const dataEntry = data[i];
            dataEntry.set(this.xyInfo.xColumnName, this.parseTime(dataEntry.get(this.xyInfo.xColumnName)));
        });
        this.data = data;
    };

    // Set the domains of the graph in x and y directions
    setXYDomains() {
        const xExtent = d3.extent(this.data, d => { return d.get(this.xyInfo.xColumnName); });

        let yMin = d3.min(this.data, d => { return d.get(this.xyInfo.yColumnName); });
        if (yMin > 0) yMin = 0;
        let yMax = d3.max(this.data, d => { return d.get(this.xyInfo.yColumnName); });
        if (yMax == 0) yMax = 1;

        const xDomain = xExtent[1].getTime() - xExtent[0].getTime();
        const xDomainMargin = xDomain * .02;

        let maxYTicks = Math.min(yMax, Math.ceil(this.height / this.yAxisLabelPadding));
        if (this.isMoneyMetric) {
            maxYTicks = Math.min(yMax * 100, Math.ceil(this.height / this.yAxisLabelPadding));
        }
        if (this.isTimeMetric) {
            maxYTicks = Math.min(yMax, Math.ceil(this.height / this.yAxisLabelPadding));
        }

        this.xyInfo.x.domain([xExtent[0].getTime() - xDomainMargin, xExtent[1].getTime() + xDomainMargin]);
        this.xyInfo.y.domain([yMin, yMax]).nice(maxYTicks);
    };

    // Create containing svg
    createSvg() {
        return this.graphContainer.append('svg')
            .attr('class', 'lineGraph')
            .attr('width', this.svgWidth.toString())
            .attr('height', this.svgHeight.toString());
    };

    // Create group containing actual graph
    createGraphCanvas() {
        return this.graphContainer.select('svg.lineGraph').append('g')
            .attr('class', 'graphCanvas')
            .attr('transform', 'translate(' + this.svgMargin.left + ',' + this.svgMargin.top + ')');
    };

    // Draws connecting line between two data points on graph
    drawLineBetweenPoints() {
        return d3.line()
            .x(d => { return this.xyInfo.x(d.get(this.xyInfo.xColumnName)); })
            .y(d => { return this.xyInfo.y(d.get(this.xyInfo.yColumnName)); });
    };

    // Creates a Tooltip for viewing data information on hover
    createTooltip() {
        return this.graphContainer.append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');
    };

    // Draw Grid Lines
    drawGridLines() {
        const yDomain = this.xyInfo.y.domain();
        let maxTicks = Math.min(yDomain[1], Math.ceil(this.height / this.yAxisLabelPadding));
        if (this.isMoneyMetric) {
            maxTicks = Math.min(yDomain[1] * 100, Math.ceil(this.height / this.yAxisLabelPadding));
        }
        if (this.isTimeMetric) {
            maxTicks = Math.min(yDomain[1], Math.ceil(this.height / this.yAxisLabelPadding));
        }

        this.graphContainer.select('.graphCanvas').append('g')
            .attr('class', 'grid-line')
            .call(d3.axisLeft(this.xyInfo.y)
                .ticks(maxTicks)
                .tickSize(-this.width)
                .tickFormat(''))
            .select('path').remove();
    };

    // Draw Baseline
    drawBaseline() {
        this.graphContainer.select('.graphCanvas').append('g')
            .attr('class', 'grid-baseline')
            .call(d3.axisLeft(this.xyInfo.y)
                .tickValues([0])
                .tickSize(-this.width)
                .tickFormat(''))
            .select('path').remove();
    };

    // Draw X-Axis
    drawXAxis() {
        const maxTicks = Math.min(this.data.length, Math.floor(this.width / this.xAxisLabelPadding));
        const dayInterval = Math.ceil(this.data.length / maxTicks);
        const filterTicksToRender = d3.timeDay.filter(d => {
            return d3.timeDay.count(0, d) % dayInterval === 0;
        });

        this.graphContainer.select('.graphCanvas').append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xyInfo.x)
                .ticks(filterTicksToRender)
                .tickFormat(this.formatTime));
    };

    // Draw Y-Axis
    drawYAxis() {
        const yDomain = this.xyInfo.y.domain();
        let maxTicks = Math.min(yDomain[1], Math.ceil(this.height / this.yAxisLabelPadding));
        if (this.isMoneyMetric) {
            maxTicks = Math.min(yDomain[1] * 100, Math.ceil(this.height / this.yAxisLabelPadding));
        }
        if (this.isTimeMetric) {
            maxTicks = Math.min(yDomain[1], Math.ceil(this.height / this.yAxisLabelPadding));
        }
        
        this.graphContainer.select('.graphCanvas').append('g')
            .attr('class', 'yAxis')
            .call(d3.axisLeft(this.xyInfo.y)
                .ticks(maxTicks)
                .tickFormat(d => {
                    if (this.isMoneyMetric) {
                        return '$' + d.toFixed(2).toLocaleString();
                    }
                    if (this.isTimeMetric) {
                        return convertSecondsToTimestamp(d);
                    }
                    return d.toLocaleString();
                }));
    };

    // Draw the path of the line graph
    drawLinePath() {
        this.graphContainer.select('.graphCanvas').append('path')
            .data([this.data])
            .attr('class', 'line')
            .attr('d', this.drawLineBetweenPoints());
    };

    // Draw data points on the line path
    drawDataPoints() {
        this.graphContainer.select('.graphCanvas').selectAll('circle.datum')
            .data(this.data)
            .enter()
            .append('circle')
                .attr('class', 'datum')
                .attr('r', 3)
                .attr('cx', d => { return this.xyInfo.x(d.get(this.xyInfo.xColumnName)); })
                .attr('cy', d => { return this.xyInfo.y(d.get(this.xyInfo.yColumnName)); });
    };

    // Draw a highlighted point to be used on data point hover
    // Display set to "none" until needed
    drawHighlightedDataPoint() {
        const graphCanvas = this.graphContainer.select('.graphCanvas');
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
    showAndSetHighlightedDataPoint(d) {
        this.graphContainer.select('.highlight-datum')
            .attr('cx', this.xyInfo.x(d.get(this.xyInfo.xColumnName)))
            .attr('cy', this.xyInfo.y(d.get(this.xyInfo.yColumnName)))
            .style('display', '');
        this.graphContainer.select('.highlight-datum-outline')
            .attr('cx', this.xyInfo.x(d.get(this.xyInfo.xColumnName)))
            .attr('cy', this.xyInfo.y(d.get(this.xyInfo.yColumnName)))
            .style('display', '');
    };

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

    // Show tooltip with correct info, and set position over correct point
    showAndSetTooltip(d) {
        // Update tooltip with correct info to display
        let yLabel = this.xyInfo.yColumnName;
        yLabel = yLabel.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
        yLabel = yLabel.charAt(0).toUpperCase() + yLabel.slice(1); // Capitalize first letter

        let yValue = d.get(this.xyInfo.yColumnName).toLocaleString();

        if (this.xyInfo.yColumnName == 'watchTime') {
            yLabel += ' (minutes)';
            yValue = Math.round(d.get(this.xyInfo.yColumnName)).toLocaleString();
            const displayTime = this.displayTimeNicely(d.get(this.xyInfo.yColumnName));
            if (displayTime.length > 0) yValue += ' (' + displayTime + ')';
        }
        if (this.xyInfo.yColumnName == 'averageViewDuration') {
            yValue = '0 seconds';
            const displayTime = this.displayTimeNicely(d.get(this.xyInfo.yColumnName) / 60); // Divide by 60 to put time in minutes
            if (displayTime.length > 0) yValue = displayTime;
        }
        if (this.xyInfo.yColumnName == 'estimatedRedPartnerRevenue') {
            yLabel = 'Estimated YouTube Red Revenue';
        }
        if (this.xyInfo.yColumnName == 'estimatedRevenue' || this.xyInfo.yColumnName == 'estimatedAdRevenue' || this.xyInfo.yColumnName == 'estimatedRedPartnerRevenue') {
            yValue = '$' + d.get(this.xyInfo.yColumnName).toFixed(2).toLocaleString();
        }

        let tooltipHtml = this.formatTime(d.get(this.xyInfo.xColumnName)) + '<br/>' + yLabel + ': ' + yValue;
        if (yLabel.length + yValue.length > 25)
            tooltipHtml = this.formatTime(d.get(this.xyInfo.xColumnName)) + '<br/>' + yLabel + ':<br/>' + yValue;

        const tooltip = this.graphContainer.select('.tooltip')
            .html(tooltipHtml)
            .style('white-space', 'nowrap')
            .style('display', ''); // Html must be created to calculate the size of the tooltip below

        // Gather positioning information
        const lineGraph = this.graphContainer.select('svg.lineGraph');
        const gContainerClientRect = this.getD3ElementPosition(this.graphContainer);
        const gGraphClientRect = this.getD3ElementPosition(lineGraph);
        const top = gGraphClientRect.top - gContainerClientRect.top + this.svgMargin.top - 7; // 7 = Additional upward padding
        const left = gGraphClientRect.left - gContainerClientRect.left + this.svgMargin.left;
        const tooltipSize = this.getD3ElementPosition(tooltip);

        // Set vertical and horizontal translations relative to container
        const verticalTranslate = top + this.xyInfo.y(d.get(this.xyInfo.yColumnName)) - tooltipSize.height;
        let horizontalTranslate = left + this.xyInfo.x(d.get(this.xyInfo.xColumnName));
        if (horizontalTranslate > left + this.width - tooltipSize.width) {
            horizontalTranslate = horizontalTranslate - tooltipSize.width;
        }

        // Set translations to tooltip
        tooltip.style('position', 'absolute')
            .style('left', horizontalTranslate + 'px')
            .style('top', verticalTranslate + 'px');
    };

    // Show condensed tooltip with correct info, and set position over correct point
    showAndSetSmallerTooltip(d) {
        // Update tooltip with correct info to display
        let yValue = d.get(this.xyInfo.yColumnName).toLocaleString();

        if (this.xyInfo.yColumnName == 'watchTime') {
            const displayTime = this.displayTimeNicely(d.get(this.xyInfo.yColumnName));
            if (displayTime.length > 0) yValue = displayTime;
        }
        if (this.xyInfo.yColumnName == 'averageViewDuration') {
            yValue = '0 seconds';
            const displayTime = this.displayTimeNicely(d.get(this.xyInfo.yColumnName) / 60); // Divide by 60 to put time in minutes
            if (displayTime.length > 0) yValue = displayTime;
        }
        if (this.xyInfo.yColumnName == 'estimatedRevenue' || this.xyInfo.yColumnName == 'estimatedAdRevenue' || this.xyInfo.yColumnName == 'estimatedRedPartnerRevenue') {
            yValue = '$' + d.get(this.xyInfo.yColumnName).toFixed(2).toLocaleString();
        }
        
        const tooltip = this.graphContainer.select('.tooltip')
            .html(yValue)
            .style('white-space', 'nowrap')
            .style('display', ''); // Html must be created to calculate the size of the tooltip below

        // Gather positioning information
        const lineGraph = this.graphContainer.select('svg.lineGraph');
        const gContainerClientRect = this.getD3ElementPosition(this.graphContainer);
        const gGraphClientRect = this.getD3ElementPosition(lineGraph);
        const top = gGraphClientRect.top - gContainerClientRect.top + this.svgMargin.top - 7; // 7 = Additional upward padding
        const left = gGraphClientRect.left - gContainerClientRect.left + this.svgMargin.left;
        const tooltipSize = this.getD3ElementPosition(tooltip);

        // Set vertical and horizontal translations relative to container
        const verticalTranslate = top + this.xyInfo.y(d.get(this.xyInfo.yColumnName)) - tooltipSize.height;
        let horizontalTranslate = left + this.xyInfo.x(d.get(this.xyInfo.xColumnName));
        if (horizontalTranslate > left + this.width - tooltipSize.width) {
            horizontalTranslate = horizontalTranslate - tooltipSize.width;
        }

        // Set translations to tooltip
        tooltip.style('position', 'absolute')
            .style('left', horizontalTranslate + 'px')
            .style('top', verticalTranslate + 'px');
    };

    // Hide highlighted data point
    hideHighlightedDataPoint() {
        this.graphContainer.select('.highlight-datum')
            .style('display', 'none');
        this.graphContainer.select('.highlight-datum-outline')
            .style('display', 'none');
    };

    // Hide tooltip
    hideTooltip() {
        this.graphContainer.select('.tooltip')
            .style('display', 'none');
    };

    // Show/hide data points and tooltip
    highlight(d) {
        if (!d) {
            this.hideHighlightedDataPoint();
            this.hideTooltip();
        } else {
            this.showAndSetHighlightedDataPoint(d);
            if (this.graphSize == 'large') this.showAndSetTooltip(d);
            if (this.graphSize == 'medium') this.showAndSetSmallerTooltip(d);
        }
    };

    // Overlays invisible canvas to handle hovering over data points
    prepareVoronoiCanvas(voronoiDiagram) {
        const graphCanvas = this.graphContainer.select('.graphCanvas');

        const hoverHandler = () => {
            const [mx, my] = d3.mouse(graphCanvas.node());
            const site = voronoiDiagram.find(mx, my, 25);
            this.highlight(site && site.data);
        };  

        graphCanvas.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('opacity', 0)
            .on('mousemove', hoverHandler)
            .on('mouseleave', () => {
                this.highlight(null);
            });
    };

    prepareXValueHover() {
        const graphCanvas = this.graphContainer.select('.graphCanvas');

        const bisector = d3.bisector(d => { return d.get(this.xyInfo.xColumnName); }).left;
        
        const hoverHandler = () => {
            const mx = this.xyInfo.x.invert(d3.mouse(graphCanvas.node())[0]);
            const dataIndex = bisector(this.data, mx, 1, this.data.length - 1);
            const leftDataPoint = this.data[dataIndex - 1];
            const rightDataPoint = this.data[dataIndex];
            const nearestDataPoint = (mx - leftDataPoint.get(this.xyInfo.xColumnName)) > (rightDataPoint.get(this.xyInfo.xColumnName) - mx)
                ? rightDataPoint
                : leftDataPoint;
            
            this.highlight(nearestDataPoint);
        };

        graphCanvas.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('opacity', 0)
            .on('mousemove', hoverHandler)
            .on('mouseleave', () => {
                this.highlight(null);
            });
    };

    // Create footnote for graph
    createGraphFootnote() {
        return this.graphContainer.select('svg.lineGraph').append('text')
            .attr('id', 'graphFootnote')
            .attr('transform', 'translate(' + this.svgMargin.left + ',' + (this.svgHeight - this.footnoteMargin) + ')')
            .text('* Data from the past 48 hours may not yet be available.')
            .style('font-size', '10px')
            .style('font-style', 'italic');
    }

    // Create a line graph
    drawLineGraph(container, dataInfo, xColumnName, yColumnName, size = 'large') {
        if (
            yColumnName == 'estimatedRevenue' || 
            yColumnName == 'estimatedAdRevenue' || 
            yColumnName == 'estimatedRedPartnerRevenue'
        ) {
            this.isMoneyMetric = true;
        } else {
            this.isMoneyMetric = false;
        }

        if (yColumnName == 'averageViewDuration') {
            this.isTimeMetric = true;
        } else {
            this.isTimeMetric = false;
        }

        container.style('position', 'relative');
        this.graphSize = size;
        this.graphContainer = container;
        this.setSizeConstants();

        const {x, y} = this.createXYScales();
        this.xyInfo = {x, y, xColumnName, yColumnName};

        this.prepareData(dataInfo);
        this.setXYDomains();

        this.createSvg();
        this.createGraphCanvas();

        this.drawBaseline();
        if (size == 'large') {
            this.drawGridLines();
            this.drawXAxis();
            this.drawYAxis();
        }

        if (size == 'large' || size == 'medium') {
            this.createTooltip();
        }

        this.drawLinePath();

        if (this.data.length < (this.width / 10)) { // if data points are closer than 10px apart, don't render points
            this.drawDataPoints();
        }

        if (size == 'medium') {
            this.drawHighlightedDataPoint();
            this.prepareXValueHover();
        }
        
        if (size == 'large') {
            this.drawHighlightedDataPoint();

            const voronoiDiagram = computeVoronoi(this.width, this.height, this.data, this.xyInfo);
            this.prepareVoronoiCanvas(voronoiDiagram);

            this.createGraphFootnote();
        }
    };
}

export default LineGraph;