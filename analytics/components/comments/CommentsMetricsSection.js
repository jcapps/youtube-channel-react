import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const CommentsMetricsSection = ({totalStats, filterState}) => {
    let totalComments = 0;
    if (totalStats.columnHeaders) {
        const totalStatsColumns = totalStats.columnHeaders.map(item => {
            return item.name;
        });
        if (totalStats.rows) {
            if (totalStatsColumns.indexOf('comments') >= 0)
                totalComments = totalStats.rows[0][totalStatsColumns.indexOf('comments')];
        } else {
            totalComments = 0;
        }
    }

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/comments", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-tab-title">COMMENTS</div>
                            <div className="metric-tab-value">{totalComments.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

CommentsMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default CommentsMetricsSection;