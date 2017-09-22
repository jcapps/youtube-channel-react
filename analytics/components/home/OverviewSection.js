import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ContentTypes from '../../globals/ContentTypes';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import getTotalStats from '../../helpers/getTotalStats';
import LineGraph from '../common/graphs/LineGraph';

class OverviewSection extends React.PureComponent {
    constructor() {
        super();
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    renderLineGraph() {
        const parentId = `${dataType}-overview-section`;
        let dataInfo = Object.assign({}, this.props.data);
        const dataType = this.props.dataType;

        if (!dataInfo.columnHeaders) return;
        if (dataType == 'watchTime') {
            dataInfo = computeWatchTimes(this.props.data);
        }

        return (
            <LineGraph
                dataInfo={dataInfo}
                xColumnName="day"
                yColumnName={dataType}
                size="medium"
                onRenderFinish={this.props.onRenderFinish}
                isLoading={this.props.state.isLoading}
            />
        );
    }

    render() {
        const dataType = this.props.dataType;
        if (this.props.state.contentType == ContentTypes.PLAYLISTS) {
            if (dataType == 'likes') return <div/>;
            if (dataType == 'comments') return <div/>;
        }

        const loadingSpinner = require('../../images/loading.gif');
        let dataSearchName = dataType;
        let sectionTitle = dataType.replace(/([A-Z])/g, ' $1').toUpperCase().trim(); // Add spaces before capital letters and make all CAPS

        if (dataType == 'watchTime') {
            dataSearchName = 'estimatedMinutesWatched';
            sectionTitle = 'WATCH TIME (MINUTES)';
        }
        const totalValue = getTotalStats(this.props.totalStats, dataSearchName);

        return (
            <Link to={{pathname: `/analytics/${dataType}`, state: this.props.state}}>
                <div id={`${dataType}-overview-section`}>
                    <div className="metric-title">{sectionTitle}</div>
                    <div className="metric-value">{totalValue.toLocaleString()}</div>
                    {this.renderLineGraph()}
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            </Link>
        );
    }
}

OverviewSection.propTypes = {
    data: PropTypes.object.isRequired,
    dataType: PropTypes.string.isRequired,
    totalStats: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    onRenderFinish: PropTypes.func.isRequired
};

export default OverviewSection;