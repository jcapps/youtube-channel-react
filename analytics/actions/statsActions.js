import {bindActionCreators} from 'redux';
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

export function getTotalStats(dateRange, filters = '') {
    return function(dispatch) {
        const {startDate, endDate} = dateRange;
        const metrics = 'views,estimatedMinutesWatched,likes,dislikes';

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
