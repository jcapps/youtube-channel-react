import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import formatDateString from '../helpers/formatDateString';
import zeroMissingData from '../helpers/zeroMissingData';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';

export function getViewsSuccess(report) {
    return { type: types.GET_VIEWS_SUCCESS, report };
}

export function getViewsError() {
    return { type: types.GET_VIEWS_ERROR };
}

export function getViews(
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
            dateRange = getStartEndDates(period, channelBirthdate);
        }
        const {startDate, endDate} = dateRange;
        dispatch(ajax.gettingViews());

        const helperActions = bindActionCreators(loginActions, dispatch);
        return helperActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, 'views', dimensions, filters).then(report => {
                    const reportData = zeroMissingData(report, startDate, endDate);
                    dispatch(getViewsSuccess(reportData));
                }).catch(error => {
                    dispatch(getViewsError());
                    throw(error);
                });
            } else {
                dispatch(getViewsError());
            }
        });
    };
}

function getStartEndDates(period, channelBirthdate) {
    const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    const today = new Date();
    const yesterday = new Date(today.getTime() - DAY_IN_MILLISECONDS);
    const yesterdayString = formatDateString(yesterday);

    switch(period) {
        case Periods.SEVEN_DAY:
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 7)),
                endDate: yesterdayString
            };
        case Periods.TWENTY_EIGHT_DAY:
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 28)),
                endDate: yesterdayString
            };
        case Periods.THIRTY_DAY:
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 30)),
                endDate: yesterdayString
            };
        case Periods.YEAR:
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 365)),
                endDate: yesterdayString
            };
        case Periods.LIFETIME:
            return {
                startDate: formatDateString(new Date(Date.parse(channelBirthdate))),
                endDate: yesterdayString
            };
        default: 
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 28)),
                endDate: yesterdayString
            };
    }
}