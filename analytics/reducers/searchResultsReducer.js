import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function searchResultsReducer(state = initialState.searchResults, action) {
    switch(action.type) {
        case types.GET_SEARCH_RESULTS_SUCCESS:
            return action.result.items;
        case types.CLEAR_STORE:
            return [];
        default:
            return state;
    }
}