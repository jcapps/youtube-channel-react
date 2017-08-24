import Periods from '../globals/Periods';
import formatDateString from '../helpers/formatDateString';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export function getViewsSuccess(report) {
    return { type: types.GET_VIEWS_SUCCESS, report };
}

export function getViews(period = Periods.ThirtyDay, dimensions = 'day', filters = '') {
    return function(dispatch) {
        const {startDate, endDate} = getStartEndDates(period);

        dispatch(ajax.gettingViews());
        return analyticsActions.getReport(startDate, endDate, 'views', dimensions, filters).then(report => {
            dispatch(getViewsSuccess(report));
        }).catch(error => {
            throw(error);
        });
    };
}

function getStartEndDates(period) {
    const today = new Date();
    const yesterday = new Date(today.getTime() - DAY_IN_MILLISECONDS);
    const yesterdayString = formatDateString(yesterday);
    switch(period) {
        case Periods.SevenDay:
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 7)),
                endDate: yesterdayString
            };
        case Periods.ThirtyDay:
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 30)),
                endDate: yesterdayString
            };
        default: 
            return {
                startDate: formatDateString(new Date(yesterday.getTime() - DAY_IN_MILLISECONDS * 7)),
                endDate: yesterdayString
            };
    }
}