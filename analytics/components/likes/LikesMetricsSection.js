import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import getTotalStats from '../../helpers/getTotalStats';

const LikesMetricsSection = ({totalStats, filterState}) => {
    const totalLikes = getTotalStats(totalStats, 'likes');
    const totalDislikes = getTotalStats(totalStats, 'dislikes');

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/likes", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">LIKES</div>
                            <div className="metric-value">{totalLikes.toLocaleString()}</div>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to={{pathname: "/analytics/dislikes", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">DISLIKES</div>
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