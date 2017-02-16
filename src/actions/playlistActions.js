import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getAllPlaylistsSuccess(playlists) {
    return { type: types.GET_ALL_PLAYLISTS_SUCCESS, playlists };
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