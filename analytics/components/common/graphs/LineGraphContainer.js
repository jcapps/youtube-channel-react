import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import LineGraph from '../../../graphs/LineGraph';

class LineGraphContainer extends React.PureComponent {
    componentDidMount() {
        if (!this.props.isLoading) {
            this.drawLineGraph(this.props);
        }
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
            metricInfo,
            size,
            onRenderFinish
        } = props;

        const container = d3.select(`.${metricInfo.name}-line-graph-container`);
        container.html('');

        const LG = new LineGraph();
        LG.drawLineGraph(container, dataInfo, xColumnName, metricInfo, size);
        onRenderFinish();
    }

    render() {
        const classString = `${this.props.metricInfo.name}-line-graph-container`;
        return <div className={classString} />;
    }
}

LineGraphContainer.defaultProps = {
    size: 'large'
};

LineGraphContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dataInfo: PropTypes.object.isRequired,
    xColumnName: PropTypes.string.isRequired,
    metricInfo: PropTypes.object.isRequired,
    onRenderFinish: PropTypes.func.isRequired,
    size: PropTypes.string
};

export default LineGraphContainer;