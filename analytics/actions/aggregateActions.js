import {bindActionCreators} from 'redux';
import Periods from '../globals/Periods';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as reportActions from './reportActions';

export function getAggregateVideoSuccess(report) {
    return { type: types.GET_AGGREGATE_VIDEO_SUCCESS, report };
}

export function getAggregateVideoError(error) {
    return { type: types.GET_AGGREGATE_VIDEO_ERROR, error };
}

export function getAggregatePlaylistSuccess(report) {
    return { type: types.GET_AGGREGATE_PLAYLIST_SUCCESS, report };
}

export function getAggregatePlaylistError(error) {
    return { type: types.GET_AGGREGATE_PLAYLIST_ERROR, error };
}

export function getAggregateVideo(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const dataTypes = [
            'comments',
            'likes',
            'dislikes',
            'shares',
            'subscribersGained',
            'subscribersLost',
            'views',
            'averageViewDuration',
            'estimatedMinutesWatched',
            'estimatedRevenue',
            'estimatedAdRevenue',
            'estimatedRedPartnerRevenue'
        ];

        const searchTerms = {
            period,
            dateRange,
            metrics: dataTypes.join(','),
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingAggregateVideo());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getAggregateVideoSuccess(report));
        }).catch(error => {
            dispatch(getAggregateVideoError(error));
        });
    };
}

export function getAggregatePlaylist(
    period = Periods.TWENTY_EIGHT_DAY,
    dateRange = null,
    filters = '',
    dimensions = 'day'
) {
    return function(dispatch) {
        const dataTypes = [
            'views',
            'estimatedMinutesWatched'
        ];

        const searchTerms = {
            period,
            dateRange,
            metrics: dataTypes.join(','),
            filters,
            dimensions
        };

        const helperReportActions = bindActionCreators(reportActions, dispatch);

        dispatch(ajax.gettingAggregatePlaylist());
        return helperReportActions.compileReport(searchTerms).then(report => {
            dispatch(getAggregatePlaylistSuccess(report));
        }).catch(error => {
            dispatch(getAggregatePlaylistError(error));
        });
    };
}