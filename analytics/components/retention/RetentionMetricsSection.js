import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import convertSecondsToTimestamp from '../../helpers/convertSecondsToTimestamp';
import getTotalStats from '../../helpers/getTotalStats';

const RetentionMetricsSection = ({totalStats, filterState}) => {
    const averageViewDuration = getTotalStats(totalStats, 'averageViewDuration');

    let time = averageViewDuration;
    if (averageViewDuration != 'N/A') {
        time = convertSecondsToTimestamp(averageViewDuration);
    }

    const renderAverageViewPercentage = () => {
        let averageViewPercentage = getTotalStats(totalStats, 'averageViewPercentage');
        if (averageViewPercentage != 'N/A') {
            averageViewPercentage = averageViewPercentage.toFixed(1);
            return (
                <li>
                    <Link to={{pathname: "/analytics/averageViewPercentage", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">AVERAGE PERCENTAGE VIEWED</div>
                            <div className="metric-value">{averageViewPercentage.toLocaleString()}%</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    const renderAverageTimeInPlaylist = () => {
        let averageTimeInPlaylist = getTotalStats(totalStats, 'averageTimeInPlaylist');
        if (averageTimeInPlaylist != 'N/A') {
            averageTimeInPlaylist = convertSecondsToTimestamp(averageTimeInPlaylist);
            return (
                <li>
                    <Link to={{pathname: "/analytics/averageTimeInPlaylist", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">AVERAGE TIME IN PLAYLIST</div>
                            <div className="metric-value">{averageTimeInPlaylist}</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
    }

    const renderViewsPerPlaylistStart = () => {
        let viewsPerPlaylistStart = getTotalStats(totalStats, 'viewsPerPlaylistStart');
        if (viewsPerPlaylistStart != 'N/A') {
            viewsPerPlaylistStart = viewsPerPlaylistStart.toFixed(2);
            return (
                <li>
                    <Link to={{pathname: "/analytics/viewsPerPlaylistStart", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">VIEWS PER PLAYLIST START</div>
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
                    <Link to={{pathname: "/analytics/averageViewDuration", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">AVERAGE VIEW DURATION</div>
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
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default RetentionMetricsSection;