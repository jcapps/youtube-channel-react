import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function searchPageTokenReducer(state = initialState.searchPageToken, action) {
    switch(action.type) {
        case types.GET_SEARCH_RESULTS_SUCCESS:
            return {
                prevPageToken: action.result.prevPageToken,
                nextPageToken: action.result.nextPageToken
            };
        case types.GET_NEXT_RESULTS_SUCCESS:
            return {
                prevPageToken: action.result.prevPageToken,
                nextPageToken: action.result.nextPageToken
            };
        case types.CLEAR_STORE:
            return {prevPageToken: "", nextPageToken: ""};
        default:
            return state;
    }
}