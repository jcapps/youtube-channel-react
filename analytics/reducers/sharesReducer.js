import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function sharesReducer(state = initialState.shares, action) {
    switch(action.type) {
        case types.GET_SHARES_SUCCESS:
            return action.report;
        case types.CLEAR_SHARES:
            return {};
        default:
            return state;
    }
}