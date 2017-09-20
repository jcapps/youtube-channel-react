import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import formatDateString from '../helpers/formatDateString';
import getDateRange from '../helpers/getDateRange';
import zeroMissingData from '../helpers/zeroMissingData';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';
import * as statsActions from './statsActions';

export function getWatchTimeSuccess(report) {
    return { type: types.GET_WATCH_TIME_SUCCESS, report };
}

export function getWatchTimeError() {
    return { type: types.GET_WATCH_ERROR };
}

export function getWatchTime(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch, getState) {
        if (!dateRange) {
            const channelInfo = getState().channelInfo;
            let channelBirthdate = '';
            if (channelInfo.snippet) channelBirthdate = channelInfo.snippet.publishedAt;
            dateRange = getDateRange(period, channelBirthdate);
        }
        const {startDate, endDate} = dateRange;
        const metrics = 'views,averageViewDuration';
        dispatch(ajax.gettingWatchTime());

        const helperLoginActions = bindActionCreators(loginActions, dispatch);
        const helperStatsActions = bindActionCreators(statsActions, dispatch);

        return helperLoginActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, dimensions, filters).then(report => {
                    const reportData = zeroMissingData(report, startDate, endDate);
                    return helperStatsActions.getTotalStats(dateRange, 'views,estimatedMinutesWatched', filters).then(() => {
                        dispatch(getWatchTimeSuccess(reportData));
                    });
                }).catch(error => {
                    dispatch(getWatchTimeError());
                    throw(error);
                });
            } else {
                dispatch(getWatchTimeError());
            }
        });
    };
}