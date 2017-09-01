import {bindActionCreators} from 'redux';
import formatDateString from '../helpers/formatDateString';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';
import * as youtubeActions from './youtubeActions';

export function getChannelInfoSuccess(channelInfo) {
    return { type: types.GET_CHANNEL_INFO_SUCCESS, channelInfo };
}

export function getSearchResultsSuccess(result) {
    return { type: types.GET_SEARCH_RESULTS_SUCCESS, result };
}

export function getSearchResultsError() {
    return { type: types.GET_SEARCH_RESULTS_ERROR };
}

export function getChannelInfo() {
    return function(dispatch) {
        dispatch(ajax.gettingChannelInfo());
        return youtubeActions.getChannelInfo().then(channelInfo => {
            dispatch(getChannelInfoSuccess(channelInfo));
        }).catch(error => {
            throw(error);
        });
    };
}

export function getSearchResults(query, searchType) {
    return function(dispatch) {
        dispatch(ajax.searchingChannel());

        const helperActions = bindActionCreators(loginActions, dispatch);
        return helperActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return youtubeActions.searchChannel(query, searchType).then(result => {
                    dispatch(getSearchResultsSuccess(result));
                }).catch(error => {
                    throw(error);
                });
            } else {
                dispatch(getSearchResultsError());
            }
        });
    };
}

export function getChannelAnalytics() {
    return function(dispatch) {
        const today = new Date();
        const startDate = formatDateString(new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365 * 4));
        const endDate = formatDateString(today);
        const metrics = 'views';
        return analyticsActions.getReport(startDate, endDate, metrics).then(report => {
            console.log(report);
        }).catch(error => {
            throw(error);
        });
    };
}