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

    const renderAverageViewPercentage = () => {
        let totalAverageViewPercentage = getTotalStats(totalStats, 'averageViewPercentage');
        if (totalAverageViewPercentage != 'N/A') {
            totalAverageViewPercentage = totalAverageViewPercentage.toFixed(1);
            return (
                <li>
                    <Link to={{pathname: "/analytics/averageViewPercentage", state: filterState}}>
                        <div className="metric-tab">
                            <div className="metric-title">AVERAGE PERCENTAGE VIEWED</div>
                            <div className="metric-value">{totalAverageViewPercentage.toLocaleString()}%</div>
                        </div>
                    </Link>
                </li>
            );
        }
        return;
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
                {renderAverageViewPercentage()}
            </ul>
        </div>
    );
};

RetentionMetricsSection.propTypes = {
    filterState: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired
};

export default RetentionMetricsSection;