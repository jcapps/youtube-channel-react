import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const CardsMetricsSection = ({totalStats}) => {
    const totalCardClicks = getTotalStats(totalStats, Metrics.CARD_CLICKS.metric);
    const totalCardTeaserClicks = getTotalStats(totalStats, Metrics.CARD_TEASER_CLICKS.metric);
    let cardClickRate = getTotalStats(totalStats, Metrics.CARD_CLICK_RATE.metric);
    let cardTeaserClickRate = getTotalStats(totalStats, Metrics.CARD_TEASER_CLICK_RATE.metric);
    if (cardClickRate != 'N/A') cardClickRate = (cardClickRate * 100).toFixed(2);
    if (cardTeaserClickRate != 'N/A') cardTeaserClickRate = (cardTeaserClickRate * 100).toFixed(2);

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={`/analytics/${Metrics.CARD_CLICKS.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.CARD_CLICKS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalCardClicks.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={`/analytics/${Metrics.CARD_CLICK_RATE.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.CARD_CLICK_RATE.displayName.toUpperCase()}</div>
                            <div className="metric-value">{cardClickRate.toLocaleString()}%</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={`/analytics/${Metrics.CARD_TEASER_CLICKS.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.CARD_TEASER_CLICKS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalCardTeaserClicks.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={`/analytics/${Metrics.CARD_TEASER_CLICK_RATE.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.CARD_TEASER_CLICK_RATE.displayName.toUpperCase()}</div>
                            <div className="metric-value">{cardTeaserClickRate.toLocaleString()}%</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

CardsMetricsSection.propTypes = {
    totalStats: PropTypes.object.isRequired
};

export default CardsMetricsSection;