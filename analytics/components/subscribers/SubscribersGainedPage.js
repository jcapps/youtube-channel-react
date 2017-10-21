import React from 'react';
import Metrics from '../../globals/Metrics';
import SubscribersMetricsSection from './SubscribersMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class SubscribersGainedPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.SUBSCRIBERS_GAINED.metric,
            Metrics.SUBSCRIBERS_LOST.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="subscribers-gained-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.SUBSCRIBERS_GAINED}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <SubscribersMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default SubscribersGainedPage;