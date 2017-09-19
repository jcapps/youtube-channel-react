import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const LikesMetricsSection = ({totalStats, filterState}) => {
    let totalLikes = 0;
    let totalDislikes = 0;
    if (totalStats.columnHeaders) {
        const totalStatsColumns = totalStats.columnHeaders.map(item => {
            return item.name;
        });
        if (totalStats.rows) {
            totalLikes = totalStats.rows[0][totalStatsColumns.indexOf('likes')];
            totalDislikes = totalStats.rows[0][totalStatsColumns.indexOf('dislikes')];
        } else {
            totalLikes = 0;
            totalDislikes = 0;
        }
    }

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/likes", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-tab-title">LIKES</div>
                            <div className="metric-tab-value">{totalLikes.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/dislikes", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-tab-title">DISLIKES</div>
                            <div className="metric-tab-value">{totalDislikes.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

LikesMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default LikesMetricsSection;