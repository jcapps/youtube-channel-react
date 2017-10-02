import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import getTotalStats from '../../helpers/getTotalStats';

const RevenueMetricsSection = ({totalStats, filterState}) => {
    let totalRevenue = getTotalStats(totalStats, 'estimatedRevenue');
    let totalAdRevenue = getTotalStats(totalStats, 'estimatedAdRevenue');
    let totalYoutubeRedRevenue = getTotalStats(totalStats, 'estimatedRedPartnerRevenue');
    if (totalRevenue != 'N/A') totalRevenue = totalRevenue.toFixed(2);
    if (totalAdRevenue != 'N/A') totalAdRevenue = totalAdRevenue.toFixed(2);
    if (totalYoutubeRedRevenue != 'N/A') totalYoutubeRedRevenue = totalYoutubeRedRevenue.toFixed(2);

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/revenue", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">ESTIMATED REVENUE</div>
                            <div className="metric-value">${totalRevenue.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/adRevenue", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">AD REVENUE</div>
                            <div className="metric-value">${totalAdRevenue.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/youtubeRedRevenue", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">YOUTUBE RED REVENUE</div>
                            <div className="metric-value">${totalYoutubeRedRevenue.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

RevenueMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default RevenueMetricsSection;