import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import convertSecondsToTimestamp from '../../helpers/convertSecondsToTimestamp';
import getTotalStats from '../../helpers/getTotalStats';

const RetentionMetricsSection = ({totalStats, filterState}) => {
    const averageViewDuration = getTotalStats(totalStats, 'averageViewDuration');

    let time = averageViewDuration;
    if (averageViewDuration != 'N/A') {
        time = convertSecondsToTimestamp(averageViewDuration);
    }

    return (
        <div className="metrics-section">
            <ul>
                <li>
                    <Link to={{pathname: "/analytics/averageViewDuration", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">AVERAGE VIEW DURATION</div>
                            <div className="metric-value">{time}</div>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

RetentionMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default RetentionMetricsSection;