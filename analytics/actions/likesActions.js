import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getLikesSuccess(report) {
    return { type: types.GET_LIKES_SUCCESS, report };
}

export function getLikesError(error) {
    return { type: types.GET_LIKES_ERROR, error };
}

export function getDislikesSuccess(report) {
    return { type: types.GET_DISLIKES_SUCCESS, report };
}

export function getDislikesError(error) {
    return { type: types.GET_DISLIKES_ERROR, error };
}

export function getLikes(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'likes',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingLikes());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getLikesSuccess(report));
        }).catch(error => {
            dispatch(getLikesError(error));
        });
    };
}

export function getDislikes(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'dislikes',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingDislikes());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getDislikesSuccess(report));
        }).catch(error => {
            dispatch(getDislikesError(error));
        });
    };
}