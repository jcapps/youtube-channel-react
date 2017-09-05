import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function searchPlaylistResultsReducer(state = initialState.searchPlaylistResults, action) {
    switch(action.type) {
        case types.GET_SEARCH_PLAYLIST_RESULTS_SUCCESS:
            return action.result.items;
        case types.CLEAR_STORE:
            return [];
        default:
            return state;
    }
}