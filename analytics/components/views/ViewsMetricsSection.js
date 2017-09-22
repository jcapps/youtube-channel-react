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
            if (totalStatsColumns.indexOf('views') >= 0)
                totalViews = totalStats.rows[0][totalStatsColumns.indexOf('views')];
            if (totalStatsColumns.indexOf('estimatedMinutesWatched') >= 0)
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
                            <div className="metric-title">VIEWS</div>
                            <div className="metric-value">{totalViews.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/watchTime", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">WATCH TIME (MINUTES)</div>
                            <div className="metric-value">{totalEstimatedMinutesWatched.toLocaleString()}</div>
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