import * as types from './actionTypes';

export function clearSearchResults() {
    return { type: types.CLEAR_SEARCH_RESULTS };
}

export function clearViews() {
    return { type: types.CLEAR_VIEWS };
}

export function clearWatchTime() {
    return { type: types.CLEAR_WATCH_TIME };
}