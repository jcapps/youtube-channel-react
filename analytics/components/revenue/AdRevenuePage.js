import React from 'react';
import Metrics from '../../globals/Metrics';
import RevenueMetricsSection from './RevenueMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class AdRevenuePage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.REVENUE.metric,
            Metrics.AD_REVENUE.metric,
            Metrics.YOUTUBE_RED_REVENUE.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="ad-revenue-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.AD_REVENUE}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <RevenueMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default AdRevenuePage;