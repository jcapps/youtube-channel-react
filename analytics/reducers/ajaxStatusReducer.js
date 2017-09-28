import * as types from '../actions/actionTypes';
import initialState from './initialState';

function isAdRevenueActionStartingType(type) {
    return (
        type == types.GETTING_AD_REVENUE
    );
}

function isAdRevenueActionSuccessType(type) {
    return (
        type == types.GET_AD_REVENUE_SUCCESS
    );
}

function isAdRevenueActionErrorType(type) {
    return (
        type == types.GET_AD_REVENUE_ERROR
    );
}

function isAggregatePlaylistActionStartingType(type) {
    return (
        type == types.GETTING_AGGREGATE_PLAYLIST
    );
}

function isAggregatePlaylistActionSuccessType(type) {
    return (
        type == types.GET_AGGREGATE_PLAYLIST_SUCCESS
    );
}

function isAggregatePlaylistActionErrorType(type) {
    return (
        type == types.GET_AGGREGATE_PLAYLIST_ERROR
    );
}

function isAggregateVideoActionStartingType(type) {
    return (
        type == types.GETTING_AGGREGATE_VIDEO
    );
}

function isAggregateVideoActionSuccessType(type) {
    return (
        type == types.GET_AGGREGATE_VIDEO_SUCCESS
    );
}

function isAggregateVideoActionErrorType(type) {
    return (
        type == types.GET_AGGREGATE_VIDEO_ERROR
    );
}

function isChannelActionStartingType(type) {
    return (
        type == types.GETTING_CHANNEL_INFO
    );
}

function isChannelActionSuccessType(type) {
    return (
        type == types.GET_CHANNEL_INFO_SUCCESS
    );
}

function isContentFilterActionStartingType(type) {
    return (
        type == types.SEARCHING_CHANNEL
    );
}

function isContentFilterActionSuccessType(type) {
    return (
        type == types.GET_SEARCH_CHANNEL_RESULTS_SUCCESS || 
        type == types.GET_SEARCH_PLAYLIST_RESULTS_SUCCESS || 
        type == types.GET_SEARCH_VIDEO_RESULTS_SUCCESS
    );
}

function isCheckingLoginActionStartingType(type) {
    return (
        type == types.GETTING_IS_LOGGED_IN
    );
}

function isCheckingLoginActionSuccessType(type) {
    return (
        type == types.GET_IS_LOGGED_IN_SUCCESS
    );
}

function isDislikesActionStartingType(type) {
    return (
        type == types.GETTING_DISLIKES
    );
}

function isDislikesActionSuccessType(type) {
    return (
        type == types.GET_DISLIKES_SUCCESS
    );
}

function isDislikesActionErrorType(type) {
    return (
        type == types.GET_DISLIKES_ERROR
    );
}

function isLikesActionStartingType(type) {
    return (
        type == types.GETTING_LIKES
    );
}

function isLikesActionSuccessType(type) {
    return (
        type == types.GET_LIKES_SUCCESS
    );
}

function isLikesActionErrorType(type) {
    return (
        type == types.GET_LIKES_ERROR
    );
}

function isLoginActionStartingType(type) {
    return (
        type == types.LOGGING_IN
    );
}

function isLoginActionSuccessType(type) {
    return (
        type == types.LOGIN_SUCCESS
    );
}

function isRevenueActionStartingType(type) {
    return (
        type == types.GETTING_REVENUE
    );
}

function isRevenueActionSuccessType(type) {
    return (
        type == types.GET_REVENUE_SUCCESS
    );
}

function isRevenueActionErrorType(type) {
    return (
        type == types.GET_REVENUE_ERROR
    );
}

function isSharesActionStartingType(type) {
    return (
        type == types.GETTING_SHARES
    );
}

function isSharesActionSuccessType(type) {
    return (
        type == types.GET_SHARES_SUCCESS
    );
}

function isSharesActionErrorType(type) {
    return (
        type == types.GET_SHARES_ERROR
    );
}

function isSubscribersActionStartingType(type) {
    return (
        type == types.GETTING_SUBSCRIBERS
    );
}

function isSubscribersActionSuccessType(type) {
    return (
        type == types.GET_SUBSCRIBERS_SUCCESS
    );
}

function isSubscribersActionErrorType(type) {
    return (
        type == types.GET_SUBSCRIBERS_ERROR
    );
}

function isTotalStatsActionStartingType(type) {
    return (
        type == types.GETTING_TOTAL_STATS
    );
}

function isTotalStatsActionSuccessType(type) {
    return (
        type == types.GET_TOTAL_STATS_SUCCESS
    );
}

function isTotalStatsActionErrorType(type) {
    return (
        type == types.GET_TOTAL_STATS_ERROR
    );
}

function isUnsubscribersActionStartingType(type) {
    return (
        type == types.GETTING_UNSUBSCRIBERS
    );
}

function isUnsubscribersActionSuccessType(type) {
    return (
        type == types.GET_UNSUBSCRIBERS_SUCCESS
    );
}

function isUnsubscribersActionErrorType(type) {
    return (
        type == types.GET_UNSUBSCRIBERS_ERROR
    );
}

function isViewsActionStartingType(type) {
    return (
        type == types.GETTING_VIEWS
    );
}

function isViewsActionSuccessType(type) {
    return (
        type == types.GET_VIEWS_SUCCESS
    );
}

function isViewsActionErrorType(type) {
    return (
        type == types.GET_VIEWS_ERROR
    );
}

function isWatchTimeActionStartingType(type) {
    return (
        type == types.GETTING_WATCH_TIME
    );
}

function isWatchTimeActionSuccessType(type) {
    return (
        type == types.GET_WATCH_TIME_SUCCESS
    );
}

function isWatchTimeActionErrorType(type) {
    return (
        type == types.GET_WATCH_TIME_ERROR
    );
}

function isYoutubeRedRevenueActionStartingType(type) {
    return (
        type == types.GETTING_YOUTUBE_RED_REVENUE
    );
}

function isYoutubeRedRevenueActionSuccessType(type) {
    return (
        type == types.GET_YOUTUBE_RED_REVENUE_SUCCESS
    );
}

function isYoutubeRedRevenueActionErrorType(type) {
    return (
        type == types.GET_YOUTUBE_RED_REVENUE_ERROR
    );
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    let currentState = Object.assign({}, state);

    if (isAdRevenueActionStartingType(action.type)) {
        currentState.adRevenue += 1;
    }
    if (isAdRevenueActionSuccessType(action.type)) {
        currentState.adRevenue -= 1;
    }
    if (isAdRevenueActionErrorType(action.type)) {
        currentState.adRevenue -= 1;
    }
    if (isAggregatePlaylistActionStartingType(action.type)) {
        let aggregateState = Object.assign({}, currentState.aggregate);
        aggregateState.playlist += 1;
        currentState.aggregate = aggregateState;
    }
    if (isAggregatePlaylistActionSuccessType(action.type)) {
        let aggregateState = Object.assign({}, currentState.aggregate);
        aggregateState.playlist -= 1;
        currentState.aggregate = aggregateState;
    }
    if (isAggregatePlaylistActionErrorType(action.type)) {
        let aggregateState = Object.assign({}, currentState.aggregate);
        aggregateState.playlist -= 1;
        currentState.aggregate = aggregateState;
    }
    if (isAggregateVideoActionStartingType(action.type)) {
        let aggregateState = Object.assign({}, currentState.aggregate);
        aggregateState.video += 1;
        currentState.aggregate = aggregateState;
    }
    if (isAggregateVideoActionSuccessType(action.type)) {
        let aggregateState = Object.assign({}, currentState.aggregate);
        aggregateState.video -= 1;
        currentState.aggregate = aggregateState;
    }
    if (isAggregateVideoActionErrorType(action.type)) {
        let aggregateState = Object.assign({}, currentState.aggregate);
        aggregateState.video -= 1;
        currentState.aggregate = aggregateState;
    }
    if (isChannelActionStartingType(action.type)) {
        currentState.channel += 1;
    }
    if (isChannelActionSuccessType(action.type)) {
        currentState.channel -= 1;
    }
    if (isContentFilterActionStartingType(action.type)) {
        currentState.contentFilter += 1;
    }
    if (isContentFilterActionSuccessType(action.type)) {
        currentState.contentFilter -= 1;
    }
    if (isCheckingLoginActionStartingType(action.type)) {
        currentState.isLoggedIn += 1;
    }
    if (isCheckingLoginActionSuccessType(action.type)) {
        currentState.isLoggedIn -= 1;
    }
    if (isDislikesActionStartingType(action.type)) {
        currentState.dislikes += 1;
    }
    if (isDislikesActionSuccessType(action.type)) {
        currentState.dislikes -= 1;
    }
    if (isDislikesActionErrorType(action.type)) {
        currentState.dislikes -= 1;
    }
    if (isLikesActionStartingType(action.type)) {
        currentState.likes += 1;
    }
    if (isLikesActionSuccessType(action.type)) {
        currentState.likes -= 1;
    }
    if (isLikesActionErrorType(action.type)) {
        currentState.likes -= 1;
    }
    if (isLoginActionStartingType(action.type)) {
        currentState.login += 1;
    }
    if (isLoginActionSuccessType(action.type)) {
        currentState.login -= 1;
    }
    if (isRevenueActionStartingType(action.type)) {
        currentState.revenue += 1;
    }
    if (isRevenueActionSuccessType(action.type)) {
        currentState.revenue -= 1;
    }
    if (isRevenueActionErrorType(action.type)) {
        currentState.revenue -= 1;
    }
    if (isSharesActionStartingType(action.type)) {
        currentState.shares += 1;
    }
    if (isSharesActionSuccessType(action.type)) {
        currentState.shares -= 1;
    }
    if (isSharesActionErrorType(action.type)) {
        currentState.shares -= 1;
    }
    if (isSubscribersActionStartingType(action.type)) {
        currentState.subscribers += 1;
    }
    if (isSubscribersActionSuccessType(action.type)) {
        currentState.subscribers -= 1;
    }
    if (isSubscribersActionErrorType(action.type)) {
        currentState.subscribers -= 1;
    }
    if (isUnsubscribersActionStartingType(action.type)) {
        currentState.unsubscribers += 1;
    }
    if (isUnsubscribersActionSuccessType(action.type)) {
        currentState.unsubscribers -= 1;
    }
    if (isUnsubscribersActionErrorType(action.type)) {
        currentState.unsubscribers -= 1;
    }
    if (isTotalStatsActionStartingType(action.type)) {
        currentState.totalStats += 1;
    }
    if (isTotalStatsActionSuccessType(action.type)) {
        currentState.totalStats -= 1;
    }
    if (isTotalStatsActionErrorType(action.type)) {
        currentState.totalStats -= 1;
    }
    if (isViewsActionStartingType(action.type)) {
        currentState.views += 1;
    }
    if (isViewsActionSuccessType(action.type)) {
        currentState.views -= 1;
    }
    if (isViewsActionErrorType(action.type)) {
        currentState.views -= 1;
    }
    if (isWatchTimeActionStartingType(action.type)) {
        currentState.watchTime += 1;
    }
    if (isWatchTimeActionSuccessType(action.type)) {
        currentState.watchTime -= 1;
    }
    if (isWatchTimeActionErrorType(action.type)) {
        currentState.watchTime -= 1;
    }
    if (isYoutubeRedRevenueActionStartingType(action.type)) {
        currentState.youtubeRedRevenue += 1;
    }
    if (isYoutubeRedRevenueActionSuccessType(action.type)) {
        currentState.youtubeRedRevenue -= 1;
    }
    if (isYoutubeRedRevenueActionErrorType(action.type)) {
        currentState.youtubeRedRevenue -= 1;
    }

    return currentState;
}