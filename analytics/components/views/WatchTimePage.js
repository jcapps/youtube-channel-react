import React from 'react';
import Metrics from '../../globals/Metrics';
import ViewsMetricsSection from './ViewsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class WatchTimePage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.VIEWS.metric,
            Metrics.WATCH_TIME.metric,
            Metrics.YOUTUBE_RED_VIEWS.metric,
            Metrics.YOUTUBE_RED_WATCH_TIME.metric,
            Metrics.AVERAGE_VIEW_DURATION.metric
        ];
        const playlistMetrics = [
            Metrics.PLAYLIST_STARTS.metric,
            Metrics.VIEWS.metric,
            Metrics.WATCH_TIME.metric,
            Metrics.AVERAGE_VIEW_DURATION.metric
        ];

        return (
            <div id="watch-time-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.WATCH_TIME}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <ViewsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default WatchTimePage;