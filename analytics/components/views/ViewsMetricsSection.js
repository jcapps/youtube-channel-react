import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const ViewsMetricsSection = ({totalStats, filterState}) => {
    let totalViews = 0;
    let totalEstimatedMinutesWatched = 0;
    if (totalStats.columnHeaders) {
        const totalStatsColumns = totalStats.columnHeaders.map(item => {
            return item.name;
        });
        if (totalStats.rows) {
            totalViews = totalStats.rows[0][totalStatsColumns.indexOf('views')];
            totalEstimatedMinutesWatched = totalStats.rows[0][totalStatsColumns.indexOf('estimatedMinutesWatched')];
        } else {
            totalViews = 0;
            totalEstimatedMinutesWatched = 0;
        }
    }

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/views", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-tab-title">VIEWS</div>
                            <div className="metric-tab-value">{totalViews.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/watchTime", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-tab-title">WATCH TIME (MINUTES)</div>
                            <div className="metric-tab-value">{totalEstimatedMinutesWatched.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

ViewsMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default ViewsMetricsSection;