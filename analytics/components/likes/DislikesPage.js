import React from 'react';
import Metrics from '../../globals/Metrics';
import LikesMetricsSection from './LikesMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class DislikesPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.LIKES.metric,
            Metrics.DISLIKES.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="dislikes-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.DISLIKES}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <LikesMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default DislikesPage;