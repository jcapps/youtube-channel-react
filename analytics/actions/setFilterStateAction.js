import * as types from './actionTypes';

export function setFilterState(state) {
    return function(dispatch) {
        dispatch({ type: types.SET_FILTER_STATE, state });
    };
}