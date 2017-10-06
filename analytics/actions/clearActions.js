import * as types from './actionTypes';

export function clearSearchResults() {
    return function(dispatch) {
        dispatch({ type: types.CLEAR_SEARCH_RESULTS });
    };
}

export function clearReport() {
    return function(dispatch) {
        dispatch({ type: types.CLEAR_REPORT });
    }
}