import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ContentTypes from '../../globals/ContentTypes';
import computeSubscribers from '../../helpers/computeSubscribers';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import getTotalStats from '../../helpers/getTotalStats';
import LineGraphContainer from '../common/graphs/LineGraphContainer';

class OverviewSection extends React.PureComponent {
    constructor() {
        super();
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    renderLineGraph() {
        const parentId = `${dataType}-overview-section`;
        let dataInfo = Object.assign({}, this.props.data);
        let dataType = this.props.dataType;

        if (!dataInfo.columnHeaders) return;
        if (dataType == 'subscribers') {
            dataInfo = computeSubscribers(this.props.data, this.props.data);
        }
        if (dataType == 'revenue') {
            dataType = 'estimatedRevenue';
        }
        if (dataType == 'adRevenue') {
            dataType = 'estimatedAdRevenue';
        }
        if (dataType == 'youtubeRedRevenue') {
            dataType = 'estimatedRedPartnerRevenue';
        }
        if (dataType == 'watchTime') {
            dataInfo = computeWatchTimes(this.props.data);
        }

        return (
            <LineGraphContainer
                dataInfo={dataInfo}
                xColumnName="day"
                yColumnName={dataType}
                size={this.props.size}
                onRenderFinish={this.props.onRenderFinish}
                isLoading={this.props.state.isLoading}
            />
        );
    }

    render() {
        const dataType = this.props.dataType;
        if (this.props.state.contentType == ContentTypes.PLAYLISTS) {
            if (dataType == 'likes') return <div/>;
            if (dataType == 'dislikes') return <div/>;
            if (dataType == 'comments') return <div/>;
            if (dataType == 'shares') return <div/>;
            if (dataType == 'subscribers') return <div/>;
            if (dataType == 'subscribersGained') return <div/>;
            if (dataType == 'subscribersLost') return <div/>;
            if (dataType == 'revenue') return <div/>;
            if (dataType == 'adRevenue') return <div/>;
            if (dataType == 'youtubeRedRevenue') return <div/>;
        }

        const loadingSpinner = require('../../images/loading.gif');
        let sectionTitle = dataType.replace(/([A-Z])/g, ' $1').toUpperCase().trim(); // Add spaces before capital letters and make all CAPS

        let totalValue;
        let dataSearchName = dataType;
        if (dataType == 'subscribers') {
            const totalSubscribers = getTotalStats(this.props.totalStats, 'subscribersGained');
            const totalUnsubscribers = getTotalStats(this.props.totalStats, 'subscribersLost');
            totalValue = totalSubscribers - totalUnsubscribers;
        } else if (dataType == 'revenue' || dataType == 'adRevenue' || dataType == 'youtubeRedRevenue') {
            if (dataType == 'revenue') {
                dataSearchName = 'estimatedRevenue';
                sectionTitle = 'ESTIMATED REVENUE';
            }
            if (dataType == 'adRevenue') {
                dataSearchName = 'estimatedAdRevenue';
                sectionTitle = 'ESTIMATED AD REVENUE';
            }
            if (dataType == 'youtubeRedRevenue') {
                dataSearchName = 'estimatedRedPartnerRevenue';
                sectionTitle = 'ESTIMATED YOUTUBE RED REVENUE';
            }
            totalValue = getTotalStats(this.props.totalStats, dataSearchName);
            totalValue = '$' + totalValue.toFixed(2);
        } else {
            if (dataType == 'watchTime') {
                dataSearchName = 'estimatedMinutesWatched';
                sectionTitle = 'WATCH TIME (MINUTES)';
            }
            totalValue = getTotalStats(this.props.totalStats, dataSearchName);
        }

        return (
            <Link to={{pathname: `/analytics/${dataType}`, state: this.props.state}}>
                <div id={`${dataType}-overview-section`} className={`${this.props.size}-overview-section`}>
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
    size: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    onRenderFinish: PropTypes.func.isRequired
};

export default OverviewSection;