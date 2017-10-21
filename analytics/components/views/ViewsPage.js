import React from 'react';
import Metrics from '../../globals/Metrics';
import ViewsMetricsSection from './ViewsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class ViewsPage extends React.PureComponent {
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
            <div id="views-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.VIEWS}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <ViewsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default ViewsPage;