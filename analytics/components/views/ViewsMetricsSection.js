import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ContentTypes from '../../globals/ContentTypes';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const ViewsMetricsSection = ({totalStats}) => {
    const totalViews = getTotalStats(totalStats, Metrics.VIEWS.metric);
    const totalWatchTime = getTotalStats(totalStats, Metrics.WATCH_TIME.metric);

    const renderPlaylistStarts = () => {
        const totalPlaylistStarts = getTotalStats(totalStats, Metrics.PLAYLIST_STARTS.metric);
        if (totalPlaylistStarts != 'N/A') {
            return (
                <li>
                    <Link to={`/analytics/${Metrics.PLAYLIST_STARTS.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.PLAYLIST_STARTS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalPlaylistStarts.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    const renderRedViews = () => {
        const totalRedViews = getTotalStats(totalStats, Metrics.YOUTUBE_RED_VIEWS.metric);
        if (totalRedViews != 'N/A') {
            return (
                <li>
                    <Link to={`/analytics/${Metrics.YOUTUBE_RED_VIEWS.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.YOUTUBE_RED_VIEWS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalRedViews.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    const renderRedWatchTime = () => {
        const totalRedWatchTime = getTotalStats(totalStats, Metrics.YOUTUBE_RED_WATCH_TIME.metric);
        if (totalRedWatchTime != 'N/A') {
            return (
                <li>
                    <Link to={`/analytics/${Metrics.YOUTUBE_RED_WATCH_TIME.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.YOUTUBE_RED_WATCH_TIME.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalRedWatchTime.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    return (
        <div className="metrics-section">
            <ul>
                {renderPlaylistStarts()}
                <li>
                    <Link to={`/analytics/${Metrics.VIEWS.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.VIEWS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalViews.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={`/analytics/${Metrics.WATCH_TIME.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.WATCH_TIME.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalWatchTime.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                {renderRedViews()}
                {renderRedWatchTime()}
            </ul>
        </div>
    );
};

ViewsMetricsSection.propTypes = {
    totalStats: PropTypes.object.isRequired
};

export default ViewsMetricsSection;