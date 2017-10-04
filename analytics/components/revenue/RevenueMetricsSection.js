import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const RevenueMetricsSection = ({totalStats, filterState}) => {
    let totalRevenue = getTotalStats(totalStats, Metrics.REVENUE.metric);
    let totalAdRevenue = getTotalStats(totalStats, Metrics.AD_REVENUE.metric);
    let totalYoutubeRedRevenue = getTotalStats(totalStats, Metrics.YOUTUBE_RED_REVENUE.metric);
    if (totalRevenue != 'N/A') totalRevenue = totalRevenue.toFixed(2);
    if (totalAdRevenue != 'N/A') totalAdRevenue = totalAdRevenue.toFixed(2);
    if (totalYoutubeRedRevenue != 'N/A') totalYoutubeRedRevenue = totalYoutubeRedRevenue.toFixed(2);

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.REVENUE.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.REVENUE.displayName.toUpperCase()}</div>
                            <div className="metric-value">${totalRevenue.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.AD_REVENUE.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.AD_REVENUE.displayName.toUpperCase()}</div>
                            <div className="metric-value">${totalAdRevenue.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.YOUTUBE_RED_REVENUE.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.YOUTUBE_RED_REVENUE.displayName.toUpperCase()}</div>
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