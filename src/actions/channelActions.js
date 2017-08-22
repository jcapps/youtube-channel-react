import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getChannelInfoSuccess(channelInfo) {
    return { type: types.GET_CHANNEL_INFO_SUCCESS, channelInfo };
}

export function getSearchResultsSuccess(result) {
    return { type: types.GET_SEARCH_RESULTS_SUCCESS, result };
}

export function getNextResultsSuccess(result) {
    return { type: types.GET_NEXT_RESULTS_SUCCESS, result };
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