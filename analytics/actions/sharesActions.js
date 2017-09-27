import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getSharesSuccess(report) {
    return { type: types.GET_SHARES_SUCCESS, report };
}

export function getSharesError(error) {
    return { type: types.GET_SHARES_ERROR, error };
}

export function getShares(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'shares',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingShares());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getSharesSuccess(report));
        }).catch(error => {
            dispatch(getSharesError(error));
        });
    };
}