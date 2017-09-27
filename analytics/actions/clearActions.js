import * as types from './actionTypes';

export function clearSearchResults() {
    return { type: types.CLEAR_SEARCH_RESULTS };
}

export function clearComments() {
    return { type: types.CLEAR_COMMENTS };
}

export function clearDislikes() {
    return { type: types.CLEAR_DISLIKES };
}

export function clearLikes() {
    return { type: types.CLEAR_LIKES };
}

export function clearRevenue() {
    return { type: types.CLEAR_REVENUE };
}

export function clearAdRevenue() {
    return { type: types.CLEAR_AD_REVENUE };
}

export function clearYoutubeRedRevenue() {
    return { type: types.CLEAR_YOUTUBE_RED_REVENUE };
}

export function clearShares() {
    return { type: types.CLEAR_SHARES };
}

export function clearSubscribers() {
    return { type: types.CLEAR_SUBSCRIBERS };
}

export function clearUnsubscribers() {
    return { type: types.CLEAR_UNSUBSCRIBERS };
}

export function clearViews() {
    return { type: types.CLEAR_VIEWS };
}

export function clearWatchTime() {
    return { type: types.CLEAR_WATCH_TIME };
}