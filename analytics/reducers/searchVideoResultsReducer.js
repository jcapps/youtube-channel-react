import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function searchVideoResultsReducer(state = initialState.searchVideoResults, action) {
    switch(action.type) {
        case types.GET_SEARCH_VIDEO_RESULTS_SUCCESS:
            return action.result.items;
        case types.CLEAR_SEARCH_RESULTS:
            return [];
        default:
            return state;
    }
}