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

function isReportActionStartingType(type) {
    return (
        type == types.GETTING_REPORT
    );
}

function isReportActionSuccessType(type) {
    return (
        type == types.GET_REPORT_SUCCESS
    );
}

function isReportActionErrorType(type) {
    return (
        type == types.GET_REPORT_ERROR
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
    if (isLoginActionStartingType(action.type)) {
        currentState.login += 1;
    }
    if (isLoginActionSuccessType(action.type)) {
        currentState.login -= 1;
    }
    if (isReportActionStartingType(action.type)) {
        currentState.report += 1;
    }
    if (isReportActionSuccessType(action.type)) {
        currentState.report -= 1;
    }
    if (isReportActionErrorType(action.type)) {
        currentState.report -= 1;
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

    return currentState;
}