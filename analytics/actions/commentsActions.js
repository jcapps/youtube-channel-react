import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import getDateRange from '../helpers/getDateRange';
import zeroMissingData from '../helpers/zeroMissingData';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';

export function getCommentsSuccess(report) {
    return { type: types.GET_COMMENTS_SUCCESS, report };
}

export function getCommentsError() {
    return { type: types.GET_COMMENTS_ERROR };
}

export function getComments(
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
        const metrics = 'comments';
        dispatch(ajax.gettingComments());

        const helperLoginActions = bindActionCreators(loginActions, dispatch);

        return helperLoginActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, dimensions, filters).then(report => {
                    const reportData = zeroMissingData(report, startDate, endDate);
                    dispatch(getCommentsSuccess(reportData));
                }).catch(error => {
                    dispatch(getCommentsError());
                    throw(error);
                });
            } else {
                dispatch(getCommentsError());
            }
        });
    };
}