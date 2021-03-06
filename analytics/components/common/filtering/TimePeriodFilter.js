import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import Periods from '../../../globals/Periods';

class TimePeriodFilter extends React.PureComponent {
    constructor() {
        super();
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
    }

    componentDidMount() {
        if (this.props.timePeriod == Periods.CUSTOM) {
            this.showCustomRange();
        }
    }

    showCustomRange() {
        $('#select-custom-range').removeClass('hidden');
    }

    hideCustomRange() {
        $('#select-custom-range').addClass('hidden');
    }
    
    changeTimePeriod(e) {
        const timePeriod = e.target.value;

        if (timePeriod == Periods.CUSTOM) {
            this.showCustomRange();
        } else {
            this.hideCustomRange();
        }
        this.props.changeTimePeriod(timePeriod, null);
    }

    setDateRange() {
        const startDate = $('#start-date').val();
        const endDate = $('#end-date').val();
        this.props.changeTimePeriod(this.props.timePeriod, {startDate, endDate});
    }

    render() {
        const now = new Date();
        const thisYear = now.getFullYear();
        return (
            <div id="time-period-filter">
                <select className="views-select" value={this.props.timePeriod} onChange={this.changeTimePeriod}>
                    <option value={Periods.SEVEN_DAY}>Last 7 Days</option>
                    <option value={Periods.TWENTY_EIGHT_DAY}>Last 28 Days</option>
                    <option value={Periods.THIRTY_DAY}>Last 30 Days</option>
                    <option value={Periods.THIS_YEAR}>This year ({thisYear})</option>
                    <option value={Periods.LAST_YEAR}>Last year ({thisYear - 1})</option>
                    <option value={Periods.YEAR}>Last 365 Days</option>
                    <option value={Periods.LIFETIME}>Lifetime</option>
                    <option value={Periods.CUSTOM}>Custom range...</option>
                </select>
                <div id="select-custom-range" className="hidden">
                    <input id="start-date" type="date" />
                    <input id="end-date" type="date" />
                    <button onClick={this.setDateRange}>Go</button>
                </div>
            </div>
        );
    }
}

TimePeriodFilter.propTypes = {
    changeTimePeriod: PropTypes.func.isRequired,
    timePeriod: PropTypes.string.isRequired
};

export default TimePeriodFilter;