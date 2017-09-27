import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import getTotalStats from '../../helpers/getTotalStats';

const SharesMetricsSection = ({totalStats, filterState}) => {
    const totalShares = getTotalStats(totalStats, 'shares');

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/shares", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">SHARES</div>
                            <div className="metric-value">{totalShares.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

SharesMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default SharesMetricsSection;