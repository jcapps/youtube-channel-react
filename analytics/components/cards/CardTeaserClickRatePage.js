import React from 'react';
import Metrics from '../../globals/Metrics';
import CardsMetricsSection from './CardsMetricsSection';
import AnalyticsDisplayPage from '../common/AnalyticsDisplayPage';

export class CardTeaserClickRatePage extends React.PureComponent {
    render() {
        const nonPlaylistMetrics = [
            Metrics.CARD_CLICKS.metric,
            Metrics.CARD_TEASER_CLICKS.metric,
            Metrics.CARD_CLICK_RATE.metric,
            Metrics.CARD_TEASER_CLICK_RATE.metric
        ];
        const playlistMetrics = [];

        return (
            <div id="card-teaser-click-rate-page">
                <AnalyticsDisplayPage
                    metricInfo={Metrics.CARD_TEASER_CLICK_RATE}
                    nonPlaylistMetrics={nonPlaylistMetrics}
                    playlistMetrics={playlistMetrics}
                >
                    <CardsMetricsSection totalStats={{}}/>
                </AnalyticsDisplayPage>
            </div>
        );
    }
}
    
export default CardTeaserClickRatePage;