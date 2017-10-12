import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import getDateRange from '../helpers/getDateRange';
import formatFiltersString from '../helpers/formatFiltersString';
import zeroMissingData from '../helpers/zeroMissingData';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';

export function getReportSuccess(report) {
    return { type: types.GET_REPORT_SUCCESS, report };
}

export function getReportError(error) {
    return { type: types.GET_REPORT_ERROR, error };
}

export function getTotalStatsSuccess(report) {
    return { type: types.GET_TOTAL_STATS_SUCCESS, report };
}

export function getTotalStatsError(error) {
    return { type: types.GET_TOTAL_STATS_ERROR, error };
}

export function getReport(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    metrics = [],
    filters = [],
    dimensions = 'day',
    sort = null
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics,
            filters,
            dimensions,
            sort
        };

        const helperReportActions = bindActionCreators({prepareReport}, dispatch);

        dispatch(ajax.gettingReport());
        return helperReportActions.prepareReport(searchTerms).then(report => {
            dispatch(getReportSuccess(report));
        }).catch(error => {
            dispatch(getReportError(error));
        });
    };
}

export function getTotalStats(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    metrics,
    filters = []
) {
    return function(dispatch) {
        const searchTerms = {
            period,
            dateRange,
            metrics,
            filters,
            dimensions: null,
            sort: null
        };

        const helperReportActions = bindActionCreators({prepareReport}, dispatch);

        dispatch(ajax.gettingTotalStats());
        return helperReportActions.prepareReport(searchTerms).then(report => {
            dispatch(getTotalStatsSuccess(report));
        }).catch(error => {
            dispatch(getTotalStatsError(error));
        });
    };
}

function prepareReport(searchTerms) {
    return function(dispatch, getState) {
        let {
            period,
            dateRange,
            metrics,
            filters,
            dimensions,
            sort
        } = searchTerms;
        
        metrics = metrics.join(',');
        filters = formatFiltersString(filters);

        if (!dateRange) {
            const channelInfo = getState().channelInfo;
            let channelBirthdate = '';
            if (channelInfo.snippet) channelBirthdate = channelInfo.snippet.publishedAt;
            dateRange = getDateRange(period, channelBirthdate);
        }
        const {startDate, endDate} = dateRange;

        const helperLoginActions = bindActionCreators(loginActions, dispatch);

        return helperLoginActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, dimensions, filters, sort).then(report => {
                    let reportData = report;
                    if (!dimensions) return reportData; // i.e. if getting Total Stats
                    if (dimensions == 'day') {
                        reportData = zeroMissingData(report, startDate, endDate);
                    }
                    return reportData;
                }).catch(error => {
                    throw(error);
                });
            } else {
                throw(error);
            }
        });
    };
}