import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import convertSecondsToTimestamp from '../../helpers/convertSecondsToTimestamp';
import getTotalStats from '../../helpers/getTotalStats';

const RetentionMetricsSection = ({totalStats}) => {
    const averageViewDuration = getTotalStats(totalStats, Metrics.AVERAGE_VIEW_DURATION.metric);

    let time = averageViewDuration;
    if (averageViewDuration != 'N/A') {
        time = convertSecondsToTimestamp(averageViewDuration);
    }

    const renderAverageViewPercentage = () => {
        let averageViewPercentage = getTotalStats(totalStats, Metrics.AVERAGE_VIEW_PERCENTAGE.metric);
        if (averageViewPercentage != 'N/A') {
            averageViewPercentage = averageViewPercentage.toFixed(1);
            return (
                <li>
                    <Link to={`/analytics/${Metrics.AVERAGE_VIEW_PERCENTAGE.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.AVERAGE_VIEW_PERCENTAGE.displayName.toUpperCase()}</div>
                            <div className="metric-value">{averageViewPercentage.toLocaleString()}%</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    const renderAverageTimeInPlaylist = () => {
        let averageTimeInPlaylist = getTotalStats(totalStats, Metrics.AVERAGE_TIME_IN_PLAYLISTS.metric);
        if (averageTimeInPlaylist != 'N/A') {
            averageTimeInPlaylist = convertSecondsToTimestamp(averageTimeInPlaylist);
            return (
                <li>
                    <Link to={`/analytics/${Metrics.AVERAGE_TIME_IN_PLAYLISTS.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.AVERAGE_TIME_IN_PLAYLISTS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{averageTimeInPlaylist}</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    const renderViewsPerPlaylistStart = () => {
        let viewsPerPlaylistStart = getTotalStats(totalStats, Metrics.VIEWS_PER_PLAYLIST_START.metric);
        if (viewsPerPlaylistStart != 'N/A') {
            viewsPerPlaylistStart = viewsPerPlaylistStart.toFixed(2);
            return (
                <li>
                    <Link to={`/analytics/${Metrics.VIEWS_PER_PLAYLIST_START.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.VIEWS_PER_PLAYLIST_START.displayName.toUpperCase()}</div>
                            <div className="metric-value">{viewsPerPlaylistStart.toLocaleString()}</div>
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
                <li>
                    <Link to={`/analytics/${Metrics.AVERAGE_VIEW_DURATION.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.AVERAGE_VIEW_DURATION.displayName.toUpperCase()}</div>
                            <div className="metric-value">{time}</div>
                        </div>
                    </Link>
                </li>
                {renderAverageViewPercentage()}
                {renderAverageTimeInPlaylist()}
                {renderViewsPerPlaylistStart()}
            </ul>
        </div>
    );
};

RetentionMetricsSection.propTypes = {
    totalStats: PropTypes.object.isRequired
};

export default RetentionMetricsSection;