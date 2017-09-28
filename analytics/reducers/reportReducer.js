import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function reportReducer(state = initialState.report, action) {
    switch(action.type) {
        case types.GET_REPORT_SUCCESS:
            return action.report;
        case types.CLEAR_REPORT:
            return {};
        default:
            return state;
    }
}