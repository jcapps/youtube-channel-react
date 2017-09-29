import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ContentTypes from '../../globals/ContentTypes';
import getTotalStats from '../../helpers/getTotalStats';

const ViewsMetricsSection = ({totalStats, filterState}) => {
    const totalViews = getTotalStats(totalStats, 'views');
    const totalWatchTime = getTotalStats(totalStats, 'estimatedMinutesWatched');

    const renderPlaylistStarts = () => {
        const totalPlaylistStarts = getTotalStats(totalStats, 'playlistStarts');
        if (totalPlaylistStarts != 'N/A') {
            return (
                <li>
                    <Link to={{pathname: "/analytics/playlistStarts", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">PLAYLIST STARTS</div>
                            <div className="metric-value">{totalPlaylistStarts.toLocaleString()}</div>
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
                    <Link to={{pathname: "/analytics/views", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">VIEWS</div>
                            <div className="metric-value">{totalViews.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/watchTime", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">WATCH TIME (MINUTES)</div>
                            <div className="metric-value">{totalWatchTime.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

ViewsMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default ViewsMetricsSection;