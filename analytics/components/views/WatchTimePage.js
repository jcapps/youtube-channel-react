import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as watchTimeActions from '../../actions/watchTimeActions';
import * as statsActions from '../../actions/statsActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';
import ViewsMetricsSection from './ViewsMetricsSection';

export class WatchTimePage extends React.PureComponent {
    constructor(props) {
        super(props);
        if (props.location.state) {
            this.state = props.location.state;
        } else {
            this.state = {
                contentType: ContentTypes.ALL,
                timePeriod: Periods.TWENTY_EIGHT_DAY,
                dateRange: null,
                filters: [],
                addedFilters: []
            };
        }
        this.state.isLoading = true;

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Watch Time";
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearActions.clearWatchTime();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps)) {
            this.setState({isLoading: false});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps) || 
            JSON.stringify(this.state) != JSON.stringify(nextState)) {
            return true;
        }
        return false;
    }

    showLoadingSpinner() {
        $('#watch-time-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#watch-time-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        this.setState({isLoading: true});

        this.showLoadingSpinner();
        this.props.actions.getWatchTime(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, 'views,estimatedMinutesWatched', formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (!this.props.watchTime.columnHeaders) return <div/>;

        const watchTimeInfo = computeWatchTimes(this.props.watchTime);
        return (
            <LineGraph
                dataInfo={watchTimeInfo}
                xColumnName="day"
                yColumnName="watchTime"
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="watch-time-page">
                <h2>Watch Time</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <ViewsMetricsSection
                    totalStats={this.props.totalStats}
                    filterState={this.state}
                />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

WatchTimePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    watchTime: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.watchTime
        + state.ajaxCallsInProgress.totalStats;

    return {
        watchTime: state.watchTime,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, watchTimeActions, statsActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            ((prev.watchTime !== next.watchTime) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(WatchTimePage);