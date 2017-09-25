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