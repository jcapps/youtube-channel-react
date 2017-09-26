import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getRevenueSuccess(report) {
    return { type: types.GET_REVENUE_SUCCESS, report };
}

export function getRevenueError(error) {
    return { type: types.GET_REVENUE_ERROR, error };
}

export function getAdRevenueSuccess(report) {
    return { type: types.GET_AD_REVENUE_SUCCESS, report };
}

export function getAdRevenueError(error) {
    return { type: types.GET_AD_REVENUE_ERROR, error };
}

export function getYoutubeRedRevenueSuccess(report) {
    return { type: types.GET_YOUTUBE_RED_REVENUE_SUCCESS, report };
}

export function getYoutubeRedRevenueError(error) {
    return { type: types.GET_YOUTUBE_RED_REVENUE_ERROR, error };
}

export function getRevenue(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'estimatedRevenue',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingRevenue());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getRevenueSuccess(report));
        }).catch(error => {
            dispatch(getRevenueError(error));
        });
    };
}

export function getAdRevenue(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'estimatedAdRevenue',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingAdRevenue());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getAdRevenueSuccess(report));
        }).catch(error => {
            dispatch(getAdRevenueError(error));
        });
    };
}

export function getYoutubeRedRevenue(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'estimatedRedPartnerRevenue',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingYoutubeRedRevenue());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getYoutubeRedRevenueSuccess(report));
        }).catch(error => {
            dispatch(getYoutubeRedRevenueError(error));
        });
    };
}