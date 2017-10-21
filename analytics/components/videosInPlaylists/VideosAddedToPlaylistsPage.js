import React from 'react';
import Metrics from '../../globals/Metrics';
import VideosInPlaylistsMetricsSection from './VideosInPlaylistsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class VideosAddedToPlaylistsPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.VIDEOS_ADDED_TO_PLAYLISTS.metric,
            Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="videos-added-to-playlists-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.VIDEOS_ADDED_TO_PLAYLISTS}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <VideosInPlaylistsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default VideosAddedToPlaylistsPage;