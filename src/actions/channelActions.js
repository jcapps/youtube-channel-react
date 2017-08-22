import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';
import * as youtubeActions from './youtubeActions';

export function loginSuccess(isLoggedIn) {
    return { type: types.LOGIN_SUCCESS, isLoggedIn };
}

export function getIsLoggedInSuccess(isLoggedIn) {
    return { type: types.GET_IS_LOGGED_IN_SUCCESS, isLoggedIn };
}

export function getChannelInfoSuccess(channelInfo) {
    return { type: types.GET_CHANNEL_INFO_SUCCESS, channelInfo };
}

export function getSearchResultsSuccess(result) {
    return { type: types.GET_SEARCH_RESULTS_SUCCESS, result };
}

export function getNextResultsSuccess(result) {
    return { type: types.GET_NEXT_RESULTS_SUCCESS, result };
}

export function login() {
    return function(dispatch) {
        dispatch(ajax.logginIn());
        return analyticsActions.login().then(isLoggedIn => {
            dispatch(loginSuccess(isLoggedIn));
        }).catch(error => {
            throw(error);
        });
    };
}

export function isLoggedIn() {
    return function(dispatch) {
        dispatch(ajax.gettingIsLoggedIn());
        return analyticsActions.isLoggedIn().then(isLoggedIn => {
            dispatch(getIsLoggedInSuccess(isLoggedIn));
        }).catch(error => {
            throw(error);
        });
    };
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

export function getSearchResults(query) {
    return function(dispatch) {
        dispatch(ajax.searchingChannel());
        return youtubeActions.searchChannel(query).then(result => {
            dispatch(getSearchResultsSuccess(result));
        }).catch(error => {
            throw(error);
        });
    };
}

export function getNextResults(query, pageToken) {
    return function(dispatch, getState) {
        dispatch(ajax.searchingChannel());
        return youtubeActions.searchChannel(query, pageToken).then(result => {
            const state = getState();
            const searchResults = [...state.searchResults, ...result.items];
            result.items = searchResults;
            dispatch(getNextResultsSuccess(result));
        }).catch(error => {
            throw(error);
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

function formatDateString(date) {
    let yyyy = date.getFullYear().toString();
    let mm = padToTwoCharacters(date.getMonth() + 1);
    let dd = padToTwoCharacters(date.getDate());

    return yyyy + '-' + mm + '-' + dd;
}

function padToTwoCharacters(number) {
    if (number < 10) {
        return '0' + number;
    } else {
        return number.toString();
    }
}