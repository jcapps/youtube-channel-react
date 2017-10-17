import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import GeoMap from '../../../graphs/GeoMap';

class GeoMapContainer extends React.PureComponent {
    componentDidMount() {
        if (!this.props.isLoading) {
            this.drawGeoMap(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.drawGeoMap(nextProps);
        }
    }

    drawGeoMap(props) {
        const {
            dataArea,
            dataInfo,
            metricInfo,
            region,
            onRenderFinish
        } = props;

        const container = d3.select(`.${metricInfo.name}-geo-map-container`);
        container.html('');

        const GM = new GeoMap();
        GM.drawMap(container.node(), dataInfo, metricInfo, dataArea, region);
        onRenderFinish();
    }

    render() {
        const classString = `${this.props.metricInfo.name}-geo-map-container geo-map-container`;
        return <div className={classString} />;
    }
}

GeoMapContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dataArea: PropTypes.string.isRequired,
    dataInfo: PropTypes.object.isRequired,
    metricInfo: PropTypes.object.isRequired,
    region: PropTypes.object.isRequired,
    onRenderFinish: PropTypes.func.isRequired
};

export default GeoMapContainer;