import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function topResultsReportReducer(state = initialState.topResultsReport, action) {
    switch(action.type) {
        case types.GET_TOP_RESULTS_REPORT_SUCCESS:
            return action.report;
        case types.CLEAR_REPORT:
            return {};
        default:
            return state;
    }
}