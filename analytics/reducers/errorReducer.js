import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function errorReducer(state = initialState.error, action) {
    switch(action.type) {
        case types.GET_CHANNEL_INFO_ERROR:
        case types.LOGIN_ERROR:
        case types.GET_IS_LOGGED_IN_ERROR:
        case types.GET_REPORT_ERROR:
        case types.GET_TOP_RESULTS_REPORT_ERROR:
        case types.GET_TOTAL_STATS_ERROR:
        case types.GET_VIDEO_ERROR:
        case types.GET_SEARCH_RESULTS_ERROR:
            return action.error;
        default:
            return state;
    }
}