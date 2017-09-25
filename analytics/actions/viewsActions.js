import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getViewsSuccess(report) {
    return { type: types.GET_VIEWS_SUCCESS, report };
}

export function getViewsError() {
    return { type: types.GET_VIEWS_ERROR };
}

export function getWatchTimeSuccess(report) {
    return { type: types.GET_WATCH_TIME_SUCCESS, report };
}

export function getWatchTimeError() {
    return { type: types.GET_WATCH_ERROR };
}

export function getViews(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'views',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingViews());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getViewsSuccess(report));
        }).catch(error => {
            dispatch(getViewsError());
        });
    };
}

export function getWatchTime(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'views,averageViewDuration',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingWatchTime());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getWatchTimeSuccess(report));
        }).catch(error => {
            dispatch(getWatchTimeError());
        });
    };
}