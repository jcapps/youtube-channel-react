import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import drawLineGraph from '../../../graphs/lineGraph';

class LineGraph extends React.PureComponent {
    componentDidMount() {
        const {
            dataInfo,
            xColumnName,
            yColumnName,
            onRenderFinish
        } = this.props;

        const container = d3.select('#line-graph-container');
        container.html('');

        drawLineGraph(container, dataInfo, xColumnName, yColumnName);
        onRenderFinish();
    }

    render() {
        return <div id="line-graph-container" />;
    }
}

LineGraph.propTypes = {
    dataInfo: PropTypes.object.isRequired,
    xColumnName: PropTypes.string.isRequired,
    yColumnName: PropTypes.string.isRequired,
    onRenderFinish: PropTypes.func.isRequired
};

export default LineGraph;