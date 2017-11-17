import * as types from './actionTypes';

export function loggingIn() {
    return {type: types.LOGGING_IN};
}

export function gettingIsLoggedIn() {
    return {type: types.GETTING_IS_LOGGED_IN};
}

export function gettingChannelInfo() {
    return {type: types.GETTING_CHANNEL_INFO};
}

export function gettingPlaylistInfo() {
    return {type: types.GETTING_PLAYLIST_INFO};
}

export function gettingVideo() {
    return {type: types.GETTING_VIDEO};
}

export function gettingReport() {
    return {type: types.GETTING_REPORT};
}

export function gettingTopResultsReport() {
    return {type: types.GETTING_TOP_RESULTS_REPORT};
}

export function searchingChannel() {
    return {type: types.SEARCHING_CHANNEL};
}

export function gettingTotalStats() {
    return {type: types.GETTING_TOTAL_STATS};
}