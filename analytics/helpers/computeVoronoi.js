import * as d3 from 'd3';

const computeVoronoi = (graphWidth, graphHeight, data, xyInfo) => {
    const voronoiDiagram = d3.voronoi()
        .x(d => xyInfo.x(d.get(xyInfo.xColumnName)))
        .y(d => xyInfo.y(d.get(xyInfo.yColumnName)))
        .size([graphWidth, graphHeight])(data);
    return voronoiDiagram;
};

export default computeVoronoi;