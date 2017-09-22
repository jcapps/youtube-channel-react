import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import drawLineGraph from '../../../graphs/lineGraph';

class LineGraph extends React.PureComponent {
    componentDidMount() {
        this.drawLineGraph(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.drawLineGraph(nextProps);
        }
    }

    drawLineGraph(props) {
        const {
            dataInfo,
            xColumnName,
            yColumnName,
            size,
            onRenderFinish
        } = props;

        const container = d3.select(`.${yColumnName}-line-graph-container`);
        container.html('');

        drawLineGraph(container, dataInfo, xColumnName, yColumnName, size);
        onRenderFinish();
    }

    render() {
        const classString = `${this.props.yColumnName}-line-graph-container`;
        return <div className={classString} />;
    }
}

LineGraph.defaultProps = {
    size: 'large'
};

LineGraph.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dataInfo: PropTypes.object.isRequired,
    xColumnName: PropTypes.string.isRequired,
    yColumnName: PropTypes.string.isRequired,
    onRenderFinish: PropTypes.func.isRequired,
    size: PropTypes.string
};

export default LineGraph;