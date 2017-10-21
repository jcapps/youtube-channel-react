import React from 'react';
import Metrics from '../../globals/Metrics';
import ViewsMetricsSection from './ViewsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class YouTubeRedViewsPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.VIEWS.metric,
            Metrics.WATCH_TIME.metric,
            Metrics.YOUTUBE_RED_VIEWS.metric,
            Metrics.YOUTUBE_RED_WATCH_TIME.metric,
            Metrics.AVERAGE_VIEW_DURATION.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="youtube-red-views-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.YOUTUBE_RED_VIEWS}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <ViewsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default YouTubeRedViewsPage;