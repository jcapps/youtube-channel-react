import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const SharesMetricsSection = ({totalStats}) => {
    const totalShares = getTotalStats(totalStats, Metrics.SHARES.metric);

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={`/analytics/${Metrics.SHARES.name}`}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.SHARES.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalShares.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

SharesMetricsSection.propTypes = {
    totalStats: PropTypes.object.isRequired
};

export default SharesMetricsSection;