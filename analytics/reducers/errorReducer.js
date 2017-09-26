import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function errorReducer(state = initialState.error, action) {
    switch(action.type) {
        case types.GET_CHANNEL_INFO_ERROR:
        case types.LOGIN_ERROR:
        case types.GET_IS_LOGGED_IN_ERROR:
        case types.GET_COMMENTS_ERROR:
        case types.GET_LIKES_ERROR:
        case types.GET_DISLIKES_ERROR:
        case types.GET_REVENUE_ERROR:
        case types.GET_AD_REVENUE_ERROR:
        case types.GET_YOUTUBE_RED_REVENUE_ERROR:
        case types.GET_SUBSCRIBERS_ERROR:
        case types.GET_UNSUBSCRIBERS_ERROR:
        case types.GET_VIEWS_ERROR:
        case types.GET_WATCH_ERROR:
        case types.GET_TOTAL_STATS_ERROR:
        case types.GET_SEARCH_RESULTS_ERROR:
            return action.error;
        default:
            return state;
    }
}