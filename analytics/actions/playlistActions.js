import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getPlaylistInfoSuccess(playlistInfo) {
    return { type: types.GET_PLAYLIST_INFO_SUCCESS, playlistInfo };
}

export function getPlaylistInfoError(error) {
    return { type: types.GET_PLAYLIST_INFO_ERROR, error };
}

export function getPlaylistInfo(id) {
    return function(dispatch) {
        dispatch(ajax.gettingPlaylistInfo());
        return youtubeActions.getPlaylistInfo(id).then(playlistInfo => {
            dispatch(getPlaylistInfoSuccess(playlistInfo));
        });
    };
}