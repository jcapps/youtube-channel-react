import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function searchInfoReducer(state = initialState.searchInfo, action) {
    switch(action.type) {
        case types.GET_SEARCH_RESULTS_SUCCESS:
            return action.result.pageInfo;
        case types.GET_NEXT_RESULTS_SUCCESS:
            return action.result.pageInfo;
        default:
            return state;
    }
}