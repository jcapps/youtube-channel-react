import React from 'react';
import Metrics from '../../globals/Metrics';
import RetentionMetricsSection from './RetentionMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class AverageViewPercentagePage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.AVERAGE_VIEW_DURATION.metric,
            Metrics.AVERAGE_VIEW_PERCENTAGE.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="average-view-percentage-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.AVERAGE_VIEW_PERCENTAGE}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <RetentionMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default AverageViewPercentagePage;