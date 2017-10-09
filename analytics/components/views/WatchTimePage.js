import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Metrics from '../../globals/Metrics';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import {setFilterState} from '../../actions/setFilterStateAction';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraphContainer from '../common/graphs/LineGraphContainer';
import ViewsMetricsSection from './ViewsMetricsSection';

export class WatchTimePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${Metrics.WATCH_TIME.displayName}`;
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearActions.clearReport();
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
        this.hideLoadingSpinner();
        return false;
    }

    showLoadingSpinner() {
        $('#watch-time-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#watch-time-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({isLoading: true});
        this.showLoadingSpinner();

        let metrics = [
            Metrics.VIEWS.metric,
            Metrics.WATCH_TIME.metric,
            Metrics.YOUTUBE_RED_VIEWS.metric,
            Metrics.YOUTUBE_RED_WATCH_TIME.metric,
            Metrics.AVERAGE_VIEW_DURATION.metric
        ];
        if (state.contentType == ContentTypes.PLAYLISTS) {
            metrics = [
                Metrics.PLAYLIST_STARTS.metric,
                Metrics.VIEWS.metric,
                Metrics.WATCH_TIME.metric,
                Metrics.AVERAGE_VIEW_DURATION.metric
            ];
        }
        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderLineGraph() {
        if (!this.props.watchTime.columnHeaders) return <div/>;

        const watchTimeInfo = computeWatchTimes(this.props.watchTime);
        return (
            <LineGraphContainer
                dataInfo={watchTimeInfo}
                xColumnName="day"
                metricInfo={Metrics.WATCH_TIME}
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
                <h2>{Metrics.WATCH_TIME.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                <ViewsMetricsSection totalStats={this.props.totalStats} />
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
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;

    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
        
    return {
        watchTime: state.report,
        totalStats: state.totalStats,
        filterState: newFilterStateObject,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch),
        setFilterState: bindActionCreators(setFilterState, dispatch)
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