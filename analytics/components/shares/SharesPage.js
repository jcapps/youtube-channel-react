import React from 'react';
import Metrics from '../../globals/Metrics';
import SharesMetricsSection from './SharesMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class SharesPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.SHARES.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="shares-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.SHARES}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <SharesMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}

export default SharesPage;