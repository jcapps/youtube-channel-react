import React from 'react';
import Metrics from '../../globals/Metrics';
import RetentionMetricsSection from './RetentionMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class AverageViewDurationPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.AVERAGE_VIEW_DURATION.metric,
            Metrics.AVERAGE_VIEW_PERCENTAGE.metric
        ];
        const playlistMetrics = [
            Metrics.AVERAGE_VIEW_DURATION.metric,
            Metrics.AVERAGE_TIME_IN_PLAYLISTS.metric,
            Metrics.VIEWS_PER_PLAYLIST_START.metric
        ];

        return (
            <div id="average-view-duration-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.AVERAGE_VIEW_DURATION}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <RetentionMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default AverageViewDurationPage;