import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import getTotalStats from '../../helpers/getTotalStats';

const SubscribersMetricsSection = ({totalStats, filterState}) => {
    const totalSubscribersGained = getTotalStats(totalStats, 'subscribersGained');
    const totalSubscribersLost = getTotalStats(totalStats, 'subscribersLost');
    const totalSubscribers = totalSubscribersGained - totalSubscribersLost;

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/subscribers", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">SUBSCRIBERS</div>
                            <div className="metric-value">{totalSubscribers.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/subscribersGained", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">SUBSCRIBERS GAINED</div>
                            <div className="metric-value">{totalSubscribersGained.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/subscribersLost", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">SUBSCRIBERS LOST</div>
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