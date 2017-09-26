import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function youtubeRedRevenueReducer(state = initialState.youtubeRedRevenue, action) {
    switch(action.type) {
        case types.GET_YOUTUBE_RED_REVENUE_SUCCESS:
            return action.report;
        case types.CLEAR_YOUTUBE_RED_REVENUE:
            return {};
        default:
            return state;
    }
}