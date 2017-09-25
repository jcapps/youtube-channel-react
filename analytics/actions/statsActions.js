import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getTotalStatsSuccess(report) {
    return { type: types.GET_TOTAL_STATS_SUCCESS, report };
}

export function getTotalStatsError() {
    return { type: types.GET_TOTAL_STATS_ERROR };
}

export function getTotalStats(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    metrics,
    filters = ''
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics,
            filters,
            dimensions: null
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingTotalStats());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getTotalStatsSuccess(report));
        }).catch(error => {
            dispatch(getTotalStatsError());
        });
    };
}
