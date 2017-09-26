import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getCommentsSuccess(report) {
    return { type: types.GET_COMMENTS_SUCCESS, report };
}

export function getCommentsError(error) {
    return { type: types.GET_COMMENTS_ERROR, error };
}

export function getComments(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics: 'comments',
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingComments());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getCommentsSuccess(report));
        }).catch(error => {
            dispatch(getCommentsError(error));
        });
    };
}