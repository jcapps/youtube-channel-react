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

export function getChannelInfoError(error) {
    return { type: types.GET_CHANNEL_INFO_ERROR, error };
}

export function getSearchChannelResultsSuccess(result) {
    return { type: types.GET_SEARCH_CHANNEL_RESULTS_SUCCESS, result };
}

export function getSearchPlaylistResultsSuccess(result) {
    return { type: types.GET_SEARCH_PLAYLIST_RESULTS_SUCCESS, result };
}

export function getSearchVideoResultsSuccess(result) {
    return { type: types.GET_SEARCH_VIDEO_RESULTS_SUCCESS, result };
}

export function getSearchResultsError(error) {
    return { type: types.GET_SEARCH_RESULTS_ERROR, error };
}

export function getChannelInfo() {
    return function(dispatch) {
        dispatch(ajax.gettingChannelInfo());
        return youtubeActions.getChannelInfo().then(channelInfo => {
            dispatch(getChannelInfoSuccess(channelInfo));
        }).catch(error => {
            dispatch(getChannelInfoError(error));
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
                    switch (searchType) {
                        case 'channel':
                            dispatch(getSearchChannelResultsSuccess(result));
                            return;
                        case 'playlist':
                            dispatch(getSearchPlaylistResultsSuccess(result));
                            return;
                        case 'video':
                            dispatch(getSearchVideoResultsSuccess(result));
                            return;
                        default:
                            dispatch(getSearchResultsError(error));
                            return;
                    }
                }).catch(error => {
                    dispatch(getSearchResultsError(error));
                });
            } else {
                dispatch(getSearchResultsError({}));
            }
        });
    };
}
