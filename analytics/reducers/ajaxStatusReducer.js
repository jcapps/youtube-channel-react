import * as types from '../actions/actionTypes';
import initialState from './initialState';

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
        type == types.GETTING_DISLIKES || 
        type == types.GETTING_TOTAL_STATS
    );
}

function isDislikesActionSuccessType(type) {
    return (
        type == types.GET_DISLIKES_SUCCESS || 
        type == types.GET_TOTAL_STATS_SUCCESS
    );
}

function isDislikesActionErrorType(type) {
    return (
        type == types.GET_DISLIKES_ERROR || 
        type == types.GET_TOTAL_STATS_ERROR
    );
}

function isLikesActionStartingType(type) {
    return (
        type == types.GETTING_LIKES || 
        type == types.GETTING_TOTAL_STATS
    );
}

function isLikesActionSuccessType(type) {
    return (
        type == types.GET_LIKES_SUCCESS || 
        type == types.GET_TOTAL_STATS_SUCCESS
    );
}

function isLikesActionErrorType(type) {
    return (
        type == types.GET_LIKES_ERROR || 
        type == types.GET_TOTAL_STATS_ERROR
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

function isViewsActionStartingType(type) {
    return (
        type == types.GETTING_VIEWS || 
        type == types.GETTING_TOTAL_STATS
    );
}

function isViewsActionSuccessType(type) {
    return (
        type == types.GET_VIEWS_SUCCESS || 
        type == types.GET_TOTAL_STATS_SUCCESS
    );
}

function isViewsActionErrorType(type) {
    return (
        type == types.GET_VIEWS_ERROR || 
        type == types.GET_TOTAL_STATS_ERROR
    );
}

function isWatchTimeActionStartingType(type) {
    return (
        type == types.GETTING_WATCH_TIME || 
        type == types.GETTING_TOTAL_STATS
    );
}

function isWatchTimeActionSuccessType(type) {
    return (
        type == types.GET_WATCH_TIME_SUCCESS || 
        type == types.GET_TOTAL_STATS_SUCCESS
    );
}

function isWatchTimeActionErrorType(type) {
    return (
        type == types.GET_WATCH_TIME_ERROR || 
        type == types.GET_TOTAL_STATS_ERROR
    );
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    let currentState = Object.assign({}, state);

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

    return currentState;
}