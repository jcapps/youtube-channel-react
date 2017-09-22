import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as commentsActions from '../../actions/commentsActions';
import * as likesActions from '../../actions/likesActions';
import * as viewsActions from '../../actions/viewsActions';
import * as watchTimeActions from '../../actions/watchTimeActions';
import * as statsActions from '../../actions/statsActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';

export class AnalyticsHomePage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            contentType: ContentTypes.ALL,
            timePeriod: Periods.TWENTY_EIGHT_DAY,
            dateRange: null,
            filters: [],
            addedFilters: []
        };
        this.state.isLoading = true;

        this.getData = this.getData.bind(this);
        this.renderComments = this.renderComments.bind(this);
        this.renderLikes = this.renderLikes.bind(this);
        this.renderViews = this.renderViews.bind(this);
        this.renderWatchTime = this.renderWatchTime.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Home";
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearActions.clearComments();
        this.props.clearActions.clearLikes();
        this.props.clearActions.clearViews();
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

    showLoadingSpinner(dataType) {
        $(`#${dataType}-overview-section .loading-spinner`).removeClass('hidden');
    }

    hideLoadingSpinner(dataType) {
        $(`#${dataType}-overview-section .loading-spinner`).addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        this.setState({isLoading: true});

        let metrics = 'comments,likes,views,estimatedMinutesWatched';
        if (state.contentType == ContentTypes.PLAYLISTS) {
            metrics = 'views,estimatedMinutesWatched';
        }

        const dataTypes = metrics.split(',');
        dataTypes.forEach(dataType => {
            if (dataType == 'estimatedMinutesWatched') {
                this.showLoadingSpinner('watchTime');
            } else {
                this.showLoadingSpinner(dataType);
            }
        });

        if (state.contentType != ContentTypes.PLAYLISTS) {
            this.props.actions.getComments(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
            this.props.actions.getLikes(state.timePeriod, state.dateRange, formatFiltersString(state.filters));    
        }
        this.props.actions.getViews(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getWatchTime(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, formatFiltersString(state.filters));
    }

    renderLineGraph(propsDataInfo, dataType, size) {
        const parentId = `${dataType}-overview-section`;
        let dataInfo = Object.assign({}, propsDataInfo);

        if (!dataInfo.columnHeaders) return;
        if (dataType == 'watchTime') {
            dataInfo = computeWatchTimes(propsDataInfo);
        }

        return (
            <LineGraph
                dataInfo={dataInfo}
                xColumnName="day"
                yColumnName={dataType}
                size={size}
                onRenderFinish={() => this.hideLoadingSpinner(dataType)}
                isLoading={this.state.isLoading}
            />
        );
    }

    renderComments() {
        if (this.state.contentType == ContentTypes.PLAYLISTS) return;
        const loadingSpinner = require('../../images/loading.gif');
        
        let totalComments = 0;
        const totalStats = this.props.totalStats;
        if (totalStats.columnHeaders) {
            const totalStatsColumns = totalStats.columnHeaders.map(item => {
                return item.name;
            });
            if (totalStats.rows) {
                if (totalStatsColumns.indexOf('comments') >= 0)
                totalComments = totalStats.rows[0][totalStatsColumns.indexOf('comments')];
            }
        }

        return (
            <Link to={{pathname: "/analytics/comments", state: this.state}}>
                <div id="comments-overview-section">
                    <div className="metric-title">COMMENTS</div>
                    <div className="metric-value">{totalComments.toLocaleString()}</div>
                    {this.renderLineGraph(this.props.comments, 'comments', 'medium')}
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            </Link>
        );
    }

    renderLikes() {
        if (this.state.contentType == ContentTypes.PLAYLISTS) return;
        const loadingSpinner = require('../../images/loading.gif');
        
        let totalLikes = 0;
        const totalStats = this.props.totalStats;
        if (totalStats.columnHeaders) {
            const totalStatsColumns = totalStats.columnHeaders.map(item => {
                return item.name;
            });
            if (totalStats.rows) {
                if (totalStatsColumns.indexOf('likes') >= 0)
                totalLikes = totalStats.rows[0][totalStatsColumns.indexOf('likes')];
            }
        }

        return (
            <Link to={{pathname: "/analytics/likes", state: this.state}}>
                <div id="likes-overview-section">
                    <div className="metric-title">LIKES</div>
                    <div className="metric-value">{totalLikes.toLocaleString()}</div>
                    {this.renderLineGraph(this.props.likes, 'likes', 'medium')}
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            </Link>
        );
    }

    renderViews() {
        const loadingSpinner = require('../../images/loading.gif');
        
        let totalViews = 0;
        const totalStats = this.props.totalStats;
        if (totalStats.columnHeaders) {
            const totalStatsColumns = totalStats.columnHeaders.map(item => {
                return item.name;
            });
            if (totalStats.rows) {
                if (totalStatsColumns.indexOf('views') >= 0)
                totalViews = totalStats.rows[0][totalStatsColumns.indexOf('views')];
            }
        }

        return (
            <Link to={{pathname: "/analytics/views", state: this.state}}>
                <div id="views-overview-section">
                    <div className="metric-title">VIEWS</div>
                    <div className="metric-value">{totalViews.toLocaleString()}</div>
                    {this.renderLineGraph(this.props.views, 'views', 'medium')}
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            </Link>
        );
    }

    renderWatchTime() {
        const loadingSpinner = require('../../images/loading.gif');

        let totalEstimatedMinutesWatched = 0;
        const totalStats = this.props.totalStats;
        if (totalStats.columnHeaders) {
            const totalStatsColumns = totalStats.columnHeaders.map(item => {
                return item.name;
            });
            if (totalStats.rows) {
                if (totalStatsColumns.indexOf('estimatedMinutesWatched') >= 0)
                    totalEstimatedMinutesWatched = totalStats.rows[0][totalStatsColumns.indexOf('estimatedMinutesWatched')];
            }
        }

        return (
            <Link to={{pathname: "/analytics/watchTime", state: this.state}}>
                <div id="watchTime-overview-section">
                    <div className="metric-title">WATCH TIME (MINUTES)</div>
                    <div className="metric-value">{totalEstimatedMinutesWatched.toLocaleString()}</div>
                    {this.renderLineGraph(this.props.watchTime, 'watchTime', 'medium')}
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            </Link>
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;
        return (
            <div id="analytics-home-page">
                <h2>YouTube Analytics Overview</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <div id="overview-sections">
                    {this.renderViews()}
                    {this.renderWatchTime()}
                    {this.renderLikes()}
                    {this.renderComments()}
                </div>
            </div>
        );
    }
}

AnalyticsHomePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    comments: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    views: PropTypes.object.isRequired,
    watchTime: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.comments
        + state.ajaxCallsInProgress.likes
        + state.ajaxCallsInProgress.views
        + state.ajaxCallsInProgress.watchTime;

    return {
        comments: state.comments,
        likes: state.likes,
        views: state.views,
        watchTime: state.watchTime,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, commentsActions, likesActions, viewsActions, watchTimeActions, statsActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            !next.isLoading
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AnalyticsHomePage);