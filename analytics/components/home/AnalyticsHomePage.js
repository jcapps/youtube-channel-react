import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as commentsActions from '../../actions/commentsActions';
import * as dislikesActions from '../../actions/dislikesActions';
import * as likesActions from '../../actions/likesActions';
import * as subscribersActions from '../../actions/subscribersActions';
import * as viewsActions from '../../actions/viewsActions';
import * as watchTimeActions from '../../actions/watchTimeActions';
import * as statsActions from '../../actions/statsActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import OverviewSection from './OverviewSection';

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
        this.props.clearActions.clearSubscribers();
        this.props.clearActions.clearUnsubscribers();
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

        let dataTypes = [
            'comments',
            'likes',
            'dislikes',
            'subscribers',
            'subscribersGained',
            'subscribersLost',
            'views',
            'estimatedMinutesWatched'
        ];
        if (state.contentType == ContentTypes.PLAYLISTS) {
            dataTypes = ['views', 'estimatedMinutesWatched'];
        }

        const newDataTypes = Object.assign([], dataTypes);

        dataTypes.forEach((dataType, i) => {
            if (dataType == 'estimatedMinutesWatched') {
                this.showLoadingSpinner('watchTime');
                return;
            }
            if (dataType == 'subscribers') {
                this.showLoadingSpinner('subscribers');
                newDataTypes.splice(i, 1);
                return;
            }
            this.showLoadingSpinner(dataType);
        });

        dataTypes = newDataTypes;
        const metrics = dataTypes.join(',');

        if (state.contentType != ContentTypes.PLAYLISTS) {
            this.props.actions.getComments(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
            this.props.actions.getLikes(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
            this.props.actions.getDislikes(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
            this.props.actions.getSubscribers(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
            this.props.actions.getUnsubscribers(state.timePeriod, state.dateRange, formatFiltersString(state.filters)); 
        }
        this.props.actions.getViews(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getWatchTime(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, formatFiltersString(state.filters));
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
                    <OverviewSection
                        data={this.props.views}
                        dataType='views'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('views')}
                    />
                    <OverviewSection
                        data={this.props.watchTime}
                        dataType='watchTime'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('watchTime')}
                    />
                    <OverviewSection
                        data={this.props.likes}
                        dataType='likes'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('likes')}
                    />
                    <OverviewSection
                        data={this.props.dislikes}
                        dataType='dislikes'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('dislikes')}
                    />
                    <OverviewSection
                        data={this.props.comments}
                        dataType='comments'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('comments')}
                    />
                    <OverviewSection
                        data={this.props.subscribers}
                        additionalData={this.props.unsubscribers}
                        dataType='subscribers'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('subscribers')}
                    />
                    <OverviewSection
                        data={this.props.subscribers}
                        dataType='subscribersGained'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('subscribersGained')}
                    />
                    <OverviewSection
                        data={this.props.unsubscribers}
                        dataType='subscribersLost'
                        totalStats={this.props.totalStats}
                        state={this.state}
                        onRenderFinish={() => this.hideLoadingSpinner('subscribersLost')}
                    />
                </div>
            </div>
        );
    }
}

AnalyticsHomePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    comments: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    dislikes: PropTypes.object.isRequired,
    subscribers: PropTypes.object.isRequired,
    unsubscribers: PropTypes.object.isRequired,
    views: PropTypes.object.isRequired,
    watchTime: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.comments
        + state.ajaxCallsInProgress.dislikes
        + state.ajaxCallsInProgress.likes
        + state.ajaxCallsInProgress.subscribers
        + state.ajaxCallsInProgress.unsubscribers
        + state.ajaxCallsInProgress.views
        + state.ajaxCallsInProgress.watchTime;

    return {
        comments: state.comments,
        dislikes: state.dislikes,
        likes: state.likes,
        subscribers: state.subscribers,
        unsubscribers: state.unsubscribers,
        views: state.views,
        watchTime: state.watchTime,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign(
        {},
        commentsActions,
        dislikesActions,
        likesActions,
        subscribersActions,
        viewsActions,
        watchTimeActions,
        statsActions
    );
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