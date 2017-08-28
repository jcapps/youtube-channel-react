import * as d3 from 'd3';

const computeVoronoi = (plotAreaWidth, plotAreaHeight, xScale, yScale, data) => {
    const voronoiDiagram = d3.voronoi()
        .x(d => xScale(d.get('day')))
        .y(d => yScale(d.get('views')))
        .size([plotAreaWidth, plotAreaHeight])(data);
    return voronoiDiagram;
}

export default computeVoronoi;