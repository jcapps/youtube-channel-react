import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function revenueReducer(state = initialState.revenue, action) {
    switch(action.type) {
        case types.GET_REVENUE_SUCCESS:
            return action.report;
        case types.CLEAR_REVENUE:
            return {};
        default:
            return state;
    }
}