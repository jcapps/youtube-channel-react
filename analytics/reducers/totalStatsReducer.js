import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function totalStatsReducer(state = initialState.totalStats, action) {
    switch(action.type) {
        case types.GET_TOTAL_STATS_SUCCESS:
            return action.report;
        default:
            return state;
    }
}