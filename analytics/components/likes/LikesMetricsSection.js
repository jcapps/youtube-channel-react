import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Metrics from '../../globals/Metrics';
import getTotalStats from '../../helpers/getTotalStats';

const LikesMetricsSection = ({totalStats, filterState}) => {
    const totalLikes = getTotalStats(totalStats, Metrics.LIKES.metric);
    const totalDislikes = getTotalStats(totalStats, Metrics.DISLIKES.metric);

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.LIKES.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.LIKES.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalLikes.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: `/analytics/${Metrics.DISLIKES.name}`, state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">{Metrics.DISLIKES.displayName.toUpperCase()}</div>
                            <div className="metric-value">{totalDislikes.toLocaleString()}</div>
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