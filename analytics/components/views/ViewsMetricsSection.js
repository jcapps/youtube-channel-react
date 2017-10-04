import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ContentTypes from '../../globals/ContentTypes';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const ViewsMetricsSection = ({totalStats, filterState}) => {
    const totalViews = getTotalStats(totalStats, Metrics.VIEWS.metric);
    const totalWatchTime = getTotalStats(totalStats, Metrics.WATCH_TIME.metric);

    const renderPlaylistStarts = () => {
        const totalPlaylistStarts = getTotalStats(totalStats, Metrics.PLAYLIST_STARTS.metric);
        if (totalPlaylistStarts != 'N/A') {
            return (
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.PLAYLIST_STARTS.name}`, state: filterState}}>
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

    return (
        <div className="metrics-section">
            <ul>
                {renderPlaylistStarts()}
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.VIEWS.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.VIEWS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalViews.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.WATCH_TIME.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.WATCH_TIME.displayName.toUpperCase()}</div>
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