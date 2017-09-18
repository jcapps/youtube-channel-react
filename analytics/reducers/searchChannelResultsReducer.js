import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function searchChannelResultsReducer(state = initialState.searchChannelResults, action) {
    switch(action.type) {
        case types.GET_SEARCH_CHANNEL_RESULTS_SUCCESS:
            return action.result.items;
        case types.CLEAR_SEARCH_RESULTS:
            return [];
        default:
            return state;
    }
}