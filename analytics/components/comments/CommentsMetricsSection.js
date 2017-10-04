import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const CommentsMetricsSection = ({totalStats, filterState}) => {
    const totalComments = getTotalStats(totalStats, Metrics.COMMENTS.metric);

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.COMMENTS.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.COMMENTS.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalComments.toLocaleString()}</div>
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