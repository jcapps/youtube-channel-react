import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import getTotalStats from '../../helpers/getTotalStats';

const VideosInPlaylistsMetricsSection = ({totalStats, filterState}) => {
    const totalVideosAddedToPlaylists = getTotalStats(totalStats, 'videosAddedToPlaylists');
    const totalVideosRemovedFromPlaylists = getTotalStats(totalStats, 'videosRemovedFromPlaylists');
    const totalVideosInPlaylists = totalVideosAddedToPlaylists - totalVideosRemovedFromPlaylists;

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/videosInPlaylists", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">VIDEOS IN PLAYLISTS</div>
                            <div className="metric-value">{totalVideosInPlaylists.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/videosAddedToPlaylists", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">VIDEOS ADDED TO PLAYLISTS</div>
                            <div className="metric-value">{totalVideosAddedToPlaylists.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/videosRemovedFromPlaylists", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">VIDEOS REMOVED FROM PLAYLISTS</div>
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