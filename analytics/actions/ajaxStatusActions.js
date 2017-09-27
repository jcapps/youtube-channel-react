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

export function searchingChannel() {
    return {type: types.SEARCHING_CHANNEL};
}

export function gettingComments() {
    return {type: types.GETTING_COMMENTS};
}

export function gettingDislikes() {
    return {type: types.GETTING_DISLIKES};
}

export function gettingLikes() {
    return {type: types.GETTING_LIKES};
}

export function gettingRevenue() {
    return {type: types.GETTING_REVENUE};
}

export function gettingAdRevenue() {
    return {type: types.GETTING_AD_REVENUE};
}

export function gettingYoutubeRedRevenue() {
    return {type: types.GETTING_YOUTUBE_RED_REVENUE};
}

export function gettingShares() {
    return {type: types.GETTING_SHARES};
}

export function gettingSubscribers() {
    return {type: types.GETTING_SUBSCRIBERS};
}

export function gettingUnsubscribers() {
    return {type: types.GETTING_UNSUBSCRIBERS};
}

export function gettingViews() {
    return {type: types.GETTING_VIEWS};
}

export function gettingWatchTime() {
    return {type: types.GETTING_WATCH_TIME};
}

export function gettingTotalStats() {
    return {type: types.GETTING_TOTAL_STATS};
}