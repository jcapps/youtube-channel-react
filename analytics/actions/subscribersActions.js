import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import getDateRange from '../helpers/getDateRange';
import zeroMissingData from '../helpers/zeroMissingData';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';

export function getSubscribersSuccess(report) {
    return { type: types.GET_SUBSCRIBERS_SUCCESS, report };
}

export function getSubscribersError() {
    return { type: types.GET_SUBSCRIBERS_ERROR };
}

export function getUnsubscribersSuccess(report) {
    return { type: types.GET_UNSUBSCRIBERS_SUCCESS, report };
}

export function getUnsubscribersError() {
    return { type: types.GET_UNSUBSCRIBERS_ERROR };
}

export function getSubscribers(
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
        const metrics = 'subscribersGained';
        dispatch(ajax.gettingSubscribers());

        const helperLoginActions = bindActionCreators(loginActions, dispatch);

        return helperLoginActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, dimensions, filters).then(report => {
                    const reportData = zeroMissingData(report, startDate, endDate);
                    dispatch(getSubscribersSuccess(reportData));
                }).catch(error => {
                    dispatch(getSubscribersError());
                    throw(error);
                });
            } else {
                dispatch(getSubscribersError());
            }
        });
    };
}

export function getUnsubscribers(
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
        const metrics = 'subscribersLost';
        dispatch(ajax.gettingUnsubscribers());

        const helperLoginActions = bindActionCreators(loginActions, dispatch);

        return helperLoginActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, dimensions, filters).then(report => {
                    const reportData = zeroMissingData(report, startDate, endDate);
                    dispatch(getUnsubscribersSuccess(reportData));
                }).catch(error => {
                    dispatch(getUnsubscribersError());
                    throw(error);
                });
            } else {
                dispatch(getUnsubscribersError());
            }
        });
    };
}