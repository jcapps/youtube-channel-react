import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const SubscribersMetricsSection = ({totalStats, filterState}) => {
    let totalSubscribers = 'N/A';
    const totalSubscribersGained = getTotalStats(totalStats, Metrics.SUBSCRIBERS_GAINED.metric);
    const totalSubscribersLost = getTotalStats(totalStats, Metrics.SUBSCRIBERS_LOST.metric);
    if (totalSubscribersGained != 'N/A' && totalSubscribersLost != 'N/A') {
        totalSubscribers = totalSubscribersGained - totalSubscribersLost;
    }

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.SUBSCRIBERS.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.SUBSCRIBERS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalSubscribers.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.SUBSCRIBERS_GAINED.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.SUBSCRIBERS_GAINED.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalSubscribersGained.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.SUBSCRIBERS_LOST.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.SUBSCRIBERS_LOST.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalSubscribersLost.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

SubscribersMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default SubscribersMetricsSection;