import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ContentTypes from '../../globals/ContentTypes';
import DataTypes from '../../globals/DataTypes';
import Metrics from '../../globals/Metrics';
import computeSubscribers from '../../helpers/computeSubscribers';
import computeVideosInPlaylists from '../../helpers/computeVideosInPlaylists';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import convertSecondsToTimestamp from '../../helpers/convertSecondsToTimestamp';
import getTotalStats from '../../helpers/getTotalStats';
import LineGraphContainer from '../common/graphs/LineGraphContainer';

class OverviewSection extends React.PureComponent {
    constructor() {
        super();
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    renderLineGraph() {
        let dataInfo = Object.assign({}, this.props.data);
        let dataName = this.props.metricInfo.name;

        if (!dataInfo.columnHeaders) return;
        if (dataName == Metrics.SUBSCRIBERS.name) {
            dataInfo = computeSubscribers(this.props.data);
        }
        if (dataName == Metrics.VIDEOS_IN_PLAYLISTS.name) {
            dataInfo = computeVideosInPlaylists(this.props.data);
        }
        if (dataName == Metrics.WATCH_TIME.name || dataName == Metrics.YOUTUBE_RED_WATCH_TIME.name) {
            dataInfo = computeWatchTimes(this.props.data);
        }

        return (
            <LineGraphContainer
                dataInfo={dataInfo}
                xColumnName="day"
                metricInfo={this.props.metricInfo}
                size={this.props.size}
                onRenderFinish={this.props.onRenderFinish}
                isLoading={this.props.state.isLoading}
            />
        );
    }

    render() {
        const loadingSpinner = require('../../images/loading.gif');

        const metricInfo = this.props.metricInfo;
        const dataName = metricInfo.name;
        let totalValue = getTotalStats(this.props.totalStats, metricInfo.metric);

        if (dataName == Metrics.SUBSCRIBERS.name) {
            const totalSubscribers = getTotalStats(this.props.totalStats, Metrics.SUBSCRIBERS_GAINED.metric);
            const totalUnsubscribers = getTotalStats(this.props.totalStats, Metrics.SUBSCRIBERS_LOST.metric);
            if (totalSubscribers == 'N/A' || totalUnsubscribers == 'N/A') {
                totalValue = 'N/A';
            } else {
                totalValue = totalSubscribers - totalUnsubscribers;
            }
        }
        if (dataName == Metrics.VIDEOS_IN_PLAYLISTS.name) {
            const totalVideosAddedToPlaylists = getTotalStats(this.props.totalStats, Metrics.VIDEOS_ADDED_TO_PLAYLISTS.name);
            const totalVideosRemovedFromPlaylists = getTotalStats(this.props.totalStats, Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.name);
            if (totalVideosAddedToPlaylists == 'N/A' || totalVideosRemovedFromPlaylists == 'N/A') {
                totalValue = 'N/A';
            } else {
                totalValue = totalVideosAddedToPlaylists - totalVideosRemovedFromPlaylists;
            }
        }
        
        if (metricInfo.dataType == DataTypes.CURRENCY) {
            if (totalValue != 'N/A') {
                totalValue = '$' + totalValue.toFixed(2).toLocaleString();
            }
        }
        if (metricInfo.dataType == DataTypes.TIME) {
            if (totalValue != 'N/A') {
                totalValue = convertSecondsToTimestamp(totalValue);
            }
        }
        if (metricInfo.dataType == DataTypes.PERCENTAGE) {
            if (totalValue != 'N/A') {
                totalValue = totalValue.toFixed(1).toLocaleString() + '%';
            }
        }
        if (metricInfo.dataType == DataTypes.RATIO) {
            if (totalValue != 'N/A') {
                totalValue = (totalValue * 100).toFixed(2).toLocaleString() + '%';
            }
        }
        if (metricInfo.dataType == DataTypes.DECIMAL) {
            if (totalValue != 'N/A') {
                totalValue = totalValue.toFixed(2).toLocaleString();
            }
        }
        if (metricInfo.dataType == DataTypes.NUMBER) {
            if (totalValue != 'N/A') {
                totalValue = totalValue.toLocaleString();
            }
        }

        return (
            <Link to={{pathname: `/analytics/${dataName}`, state: this.props.state}}>
                <div id={`${dataName}-overview-section`} className={`${this.props.size}-overview-section`}>
                    <div className="metric-title">{this.props.metricInfo.displayName.toUpperCase()}</div>
                    <div className="metric-value">{totalValue}</div>
                    {this.renderLineGraph()}
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            </Link>
        );
    }
}

OverviewSection.propTypes = {
    data: PropTypes.object.isRequired,
    metricInfo: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    onRenderFinish: PropTypes.func.isRequired
};

export default OverviewSection;