import * as types from './actionTypes';

export function clearSearchResults() {
    return { type: types.CLEAR_SEARCH_RESULTS };
}

export function clearReport() {
    return { type: types.CLEAR_REPORT };
}