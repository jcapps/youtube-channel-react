import React from 'react';
import Metrics from '../../globals/Metrics';
import CommentsMetricsSection from './CommentsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class CommentsPage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.COMMENTS.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="comments-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.COMMENTS}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <CommentsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default CommentsPage;