import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from "react-router-dom";
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import GraphTypes from '../../globals/GraphTypes';
import Metrics from '../../globals/Metrics';
import computeSubscribers from '../../helpers/computeSubscribers';
import computeVideosInPlaylists from '../../helpers/computeVideosInPlaylists';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import {setFilterState} from '../../actions/setFilterStateAction';
import FiltersSection from '../common/filtering/FiltersSection';
import GraphContainer from '../common/graphs/GraphContainer';

export class AnalyticsDisplayPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            metrics: [],
            nonPlaylistMetrics: props.nonPlaylistMetrics,
            playlistMetrics: props.playlistMetrics,
            playlistAttempted: props.filterState.contentType == ContentTypes.PLAYLISTS,
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderGraphContainer = this.renderGraphContainer.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${this.props.metricInfo.displayName}`;
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearActions.clearReport();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.data) != JSON.stringify(nextProps.data)) {
            this.setState({isLoading: false});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props.data) != JSON.stringify(nextProps.data) || 
            JSON.stringify(this.state) != JSON.stringify(nextState)) {
            return true;
        }
        this.hideLoadingSpinner();
        return false;
    }

    showLoadingSpinner() {
        $('#analytics-display-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#analytics-display-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            if (!this.props.metricInfo.isPlaylistMetric) {
                this.props.setFilterState(state);
                if (
                    this.props.metricInfo.name == Metrics.YOUTUBE_RED_VIEWS.name ||
                    this.props.metricInfo.name == Metrics.YOUTUBE_RED_WATCH_TIME.name
                ) {
                    this.props.history.push(`/analytics/${Metrics.VIEWS.name}`);
                    return;
                }
                if (this.props.metricInfo.name == Metrics.AVERAGE_VIEW_PERCENTAGE.name) {
                    this.props.history.push(`/analytics/${Metrics.AVERAGE_VIEW_DURATION.name}`);
                    return;
                }
                this.props.clearActions.clearReport();
                return;
            }
        } else {
            this.setState({playlistAttempted: false});
            if (!this.props.metricInfo.isVideoMetric) {
                this.props.setFilterState(state);
                if (this.props.metricInfo.name == Metrics.PLAYLIST_STARTS.name) {
                    this.props.history.push(`/analytics/${Metrics.VIEWS.name}`);
                    return;
                }
                if (
                    this.props.metricInfo.name == Metrics.AVERAGE_TIME_IN_PLAYLISTS.name ||
                    this.props.metricInfo.name == Metrics.VIEWS_PER_PLAYLIST_START.name
                ) {
                    this.props.history.push(`/analytics/${Metrics.AVERAGE_VIEW_DURATION.name}`);
                    return;
                }
                this.props.clearActions.clearReport();
                return;
            }
        }

        this.setState({isLoading: true});
        this.showLoadingSpinner();

        let metrics = this.state.nonPlaylistMetrics;
        if (state.contentType == ContentTypes.PLAYLISTS) {
            metrics = this.state.playlistMetrics;
        }
        this.setState({metrics: metrics});

        if (this.props.graphType == GraphTypes.LINE) {
            this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        }
        if (this.props.graphType == GraphTypes.GEO) {
            const sort = '-' + this.props.metricInfo.metric;
            let dimensions = 'country';
            for (let i = 0; i < state.filters.length; i++) {
                if (state.filters[i].key == 'country' && state.filters[i].value == 'US') {
                    dimensions = 'province';
                }
            }
            this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters, dimensions, sort);
        }
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderGraphContainer() {
        if (this.state.playlistAttempted && !this.props.metricInfo.isPlaylistMetric) {
            return (
                <div className="error-message">
                    {`The ${this.props.metricInfo.displayName} metric does not allow filtering by playlist.`}
                </div>
            );
        }
        if (!this.props.data.columnHeaders) return <div/>;

        let dataInfo = this.props.data;
        if (this.props.metricInfo == Metrics.SUBSCRIBERS) {
            dataInfo = computeSubscribers(this.props.data);
        }
        if (this.props.metricInfo == Metrics.VIDEOS_IN_PLAYLISTS) {
            dataInfo = computeVideosInPlaylists(this.props.data);
        }
        if (
            this.props.metricInfo == Metrics.WATCH_TIME ||
            this.props.metricInfo == Metrics.YOUTUBE_RED_WATCH_TIME
        ) {
            dataInfo = computeWatchTimes(this.props.data);
        }

        return (
            <GraphContainer
                dataInfo={dataInfo}
                metrics={this.state.metrics}
                metricInfo={this.props.metricInfo}
                onRenderStart={this.showLoadingSpinner}
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const childWithProps = React.Children.map(
            this.props.children,
            child => React.cloneElement(child, {
                totalStats: this.props.totalStats
            })
        );
        const loadingSpinner = require('../../images/loading.gif');

        return (
            <div id="analytics-display-page">
                <h2>{this.props.metricInfo.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                {childWithProps}
                {this.renderGraphContainer()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

AnalyticsDisplayPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    metricInfo: PropTypes.object.isRequired,
    nonPlaylistMetrics: PropTypes.array.isRequired,
    playlistMetrics: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    graphType: PropTypes.string.isRequired,
    history: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;
        
    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
    
    return {
        data: state.report,
        totalStats: state.totalStats,
        filterState: newFilterStateObject,
        graphType: state.graphType,
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
            ((prev.data !== next.data) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(withRouter(AnalyticsDisplayPage));