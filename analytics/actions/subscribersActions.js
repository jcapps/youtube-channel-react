import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

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
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'subscribersGained',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingSubscribers());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getSubscribersSuccess(report));
        }).catch(error => {
            dispatch(getSubscribersError());
        });
    };
}

export function getUnsubscribers(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'subscribersLost',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingUnsubscribers());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getUnsubscribersSuccess(report));
        }).catch(error => {
            dispatch(getUnsubscribersError());
        });
    };
}