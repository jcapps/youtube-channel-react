import * as d3 from 'd3';
import computeVoronoi from '../helpers/computeVoronoi';

const lineGraph = (container, viewsInfo, xColumnName, yColumnName) => {
    const svg = container.append("svg")
        .attr("width", "960")
        .attr("height", "400");
    
    const margin = {top: 20, right: 25, bottom: 30, left: 50};
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const parseTime = d3.timeParse("%Y-%m-%d");
    const formatTime = d3.timeFormat("%x");
    
    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    
    const line = d3.line()
        .x(d => { return x(d.get(xColumnName)); })
        .y(d => { return y(d.get(yColumnName)); });

    const tooltip = container.append("div")
        .attr("class", "tooltip")
        .style("display", "none");

    const columns = viewsInfo.columnHeaders.map(item => {
        return item.name;
    });
    const data = viewsInfo.rows;
    data.forEach((item, i) => {
        data[i] = d3.map(item, (d, i) => {
            return columns[i];
        });
        const dataEntry = data[i];
        dataEntry.set(xColumnName, parseTime(dataEntry.get(xColumnName)));
    });

    x.domain(d3.extent(data, d => { return d.get(xColumnName); })).nice();
    y.domain([0, d3.max(data, d => { return d.get(yColumnName); })]).nice();

    g.append("g")
        .attr("class", "grid-line")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat(""));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(formatTime));
    
    const leftAxis = g.append("g")
        .call(d3.axisLeft(y));
        
    g.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

    if (data.length < (width / 10)) { // if data points are closer than 10px apart, don't render points
        g.selectAll("circle.datum")
            .data(data)
            .enter()
            .append("circle")
                .attr("class", "datum")
                .attr("r", 3)
                .attr("cx", d => { return x(d.get(xColumnName)); })
                .attr("cy", d => { return y(d.get(yColumnName)); });
    }

    g.append("circle")
        .attr("class", "highlight-datum")
        .attr("r", 3)
        .style("display", "none");

    g.append("circle")
        .attr("class", "highlight-datum-outline")
        .attr("r", 5)
        .style("display", "none");

    const voronoiDiagram = computeVoronoi(width, height, x, y, data);

    const getGraphPosition = () => {
        return g.node().getBoundingClientRect();
    }

    const getTooltipSize = tooltipElem => {
        return tooltipElem.node().getBoundingClientRect()
    }

    const highlight = d => {
        if (!d) {
            d3.select(".highlight-datum")
                .style("display", "none");
            d3.select(".highlight-datum-outline")
                .style("display", "none");
            d3.select(".tooltip")
                .style("display", "none");
        } else {
            d3.select(".highlight-datum")
                .attr("cx", x(d.get(xColumnName)))
                .attr("cy", y(d.get(yColumnName)))
                .style("display", "");
            d3.select(".highlight-datum-outline")
                .attr("cx", x(d.get(xColumnName)))
                .attr("cy", y(d.get(yColumnName)))
                .style("display", "");
            
            const gClientRect = getGraphPosition();
            const top = gClientRect.top;
            const left = gClientRect.left;
            const yLabel = yColumnName.charAt(0).toUpperCase() + yColumnName.slice(1);
            d3.select(".tooltip")
                .html(formatTime(d.get(xColumnName)) + "<br/>" + yLabel + ": " + d.get(yColumnName))
                .style("display", "");

            const tooltipSize = getTooltipSize(d3.select(".tooltip"));
            let horizontalTranslate = left + document.body.scrollLeft + x(d.get(xColumnName)) + leftAxis.node().getBoundingClientRect().width;
            const verticalTranslate = top + document.body.scrollTop + y(d.get(yColumnName)) - tooltipSize.height;
            if (horizontalTranslate > left + width - tooltipSize.width) {
                horizontalTranslate = horizontalTranslate - tooltip.width;
            }
            d3.select(".tooltip")
                .style("left", horizontalTranslate + "px")
                .style("top", verticalTranslate + "px");
        }
    }

    const mouseMoveHandler = () => {
        const [mx, my] = d3.mouse(g.node());
        const site = voronoiDiagram.find(mx, my, 25);
        highlight(site && site.data);
    }

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0)
        .on("mousemove", mouseMoveHandler)
        .on("mouseleave", () => {
            highlight(null);
        });
}

export default lineGraph;