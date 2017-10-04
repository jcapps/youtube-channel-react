import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const VideosInPlaylistsMetricsSection = ({totalStats, filterState}) => {
    let totalVideosInPlaylists = 'N/A';
    const totalVideosAddedToPlaylists = getTotalStats(totalStats, Metrics.VIDEOS_ADDED_TO_PLAYLISTS.metric);
    const totalVideosRemovedFromPlaylists = getTotalStats(totalStats, Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.metric);
    if (totalVideosAddedToPlaylists != 'N/A' && totalVideosRemovedFromPlaylists != 'N/A') {
        totalVideosInPlaylists = totalVideosAddedToPlaylists - totalVideosRemovedFromPlaylists;
    }

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.VIDEOS_IN_PLAYLISTS.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.VIDEOS_IN_PLAYLISTS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalVideosInPlaylists.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.VIDEOS_ADDED_TO_PLAYLISTS.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.VIDEOS_ADDED_TO_PLAYLISTS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalVideosAddedToPlaylists.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalVideosRemovedFromPlaylists.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

VideosInPlaylistsMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default VideosInPlaylistsMetricsSection;