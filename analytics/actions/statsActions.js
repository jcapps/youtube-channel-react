import {bindActionCreators} from 'redux';
import getDateRange from '../helpers/getDateRange';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';

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
    return function(dispatch, getState) {
        if (!dateRange) {
            const channelInfo = getState().channelInfo;
            let channelBirthdate = '';
            if (channelInfo.snippet) channelBirthdate = channelInfo.snippet.publishedAt;
            dateRange = getDateRange(period, channelBirthdate);
        }
        const {startDate, endDate} = dateRange;

        dispatch(ajax.gettingTotalStats());
        const helperActions = bindActionCreators(loginActions, dispatch);
        return helperActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, null, filters).then(report => {
                    dispatch(getTotalStatsSuccess(report));
                }).catch(error => {
                    dispatch(getTotalStatsError());
                    throw(error);
                });
            } else {
                dispatch(getTotalStatsError());
            }
        });
    }
}
