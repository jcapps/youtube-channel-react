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

export function gettingReport() {
    return {type: types.GETTING_REPORT};
}

export function searchingChannel() {
    return {type: types.SEARCHING_CHANNEL};
}

export function gettingTotalStats() {
    return {type: types.GETTING_TOTAL_STATS};
}