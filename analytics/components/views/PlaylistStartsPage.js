import React from 'react';
import Metrics from '../../globals/Metrics';
import ViewsMetricsSection from './ViewsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class PlaylistStartsPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [];
        const playlistMetrics = [
            Metrics.VIEWS.metric,
            Metrics.WATCH_TIME.metric,
            Metrics.PLAYLIST_STARTS.metric,
            Metrics.AVERAGE_VIEW_DURATION.metric
        ];

        return (
            <div id="playlist-starts-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.PLAYLIST_STARTS}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <ViewsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default PlaylistStartsPage;