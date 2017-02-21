import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getAllPlaylistsSuccess(playlists) {
    return { type: types.GET_ALL_PLAYLISTS_SUCCESS, playlists };
}

export function getNextPlaylistsSuccess(playlists) {
    return { type: types.GET_NEXT_PLAYLISTS_SUCCESS, playlists };
}

export function getPlaylistSuccess(playlist) {
    return { type: types.GET_PLAYLIST_SUCCESS, playlist };
}

export function getPlaylistInfoSuccess(playlistInfo) {
    return { type: types.GET_PLAYLIST_INFO_SUCCESS, playlistInfo };
}

export function getAllPlaylists() {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);

        dispatch(beginAjaxCall());
        return apiActions.getAllPlaylists().then(playlists => {
            dispatch(getAllPlaylistsSuccess(playlists));
        });
    };
}

export function getNextPlaylists(nextPageToken) {
    return function(dispatch, getState) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);

        dispatch(beginAjaxCall());
        return apiActions.getAllPlaylists(nextPageToken).then(playlists => {
            const state = getState();
            const allPlaylists = [...state.allPlaylists, ...playlists.items];
            playlists.items = allPlaylists;
            dispatch(getNextPlaylistsSuccess(playlists));
        });
    };
}

export function getPlaylist(id) {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);

        dispatch(beginAjaxCall());
        return apiActions.getPlaylist(id).then(playlist => {
            dispatch(getPlaylistSuccess(playlist));
        });
    };
}

export function getPlaylistInfo(id) {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);

        dispatch(beginAjaxCall());
        return apiActions.getPlaylistInfo(id).then(playlist => {
            dispatch(getPlaylistInfoSuccess(playlist));
        });
    };
}