import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function adRevenueReducer(state = initialState.adRevenue, action) {
    switch(action.type) {
        case types.GET_AD_REVENUE_SUCCESS:
            return action.report;
        case types.CLEAR_AD_REVENUE:
            return {};
        default:
            return state;
    }
}