import React from 'react';
import Metrics from '../../globals/Metrics';
import RetentionMetricsSection from './RetentionMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class AverageTimeInPlaylistPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [];
        const playlistMetrics = [
            Metrics.AVERAGE_VIEW_DURATION.metric,
            Metrics.AVERAGE_TIME_IN_PLAYLISTS.metric,
            Metrics.VIEWS_PER_PLAYLIST_START.metric
        ];

        return (
            <div id="average-time-in-playlist-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.AVERAGE_TIME_IN_PLAYLISTS}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <RetentionMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default AverageTimeInPlaylistPage;