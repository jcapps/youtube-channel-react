import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getRecentUploadsPlaylistSuccess(playlist) {
    return { type: types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS, playlist };
}

export function getMostRecentUploadSuccess(video) {
    return { type: types.GET_MOST_RECENT_UPLOAD_SUCCESS, video };
}

export function getRecentUploadsPlaylist() {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);

        dispatch(beginAjaxCall());
        return apiActions.getChannelInfo().then(channelInfo => {
            let playlistId = channelInfo.contentDetails.relatedPlaylists.uploads;
            dispatch(beginAjaxCall());
            return apiActions.getPlaylistInfo(playlistId).then(playlist => {
                dispatch(getRecentUploadsPlaylistSuccess(playlist));
                return playlist;
            });
        });
    };
}

export function getMostRecentUpload() {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);
        const getRecentUploadsAction = bindActionCreators(getRecentUploadsPlaylist, dispatch);

        dispatch(beginAjaxCall());
        return getRecentUploadsAction().then(playlist => {
            let videoId = playlist[0].snippet.resourceId.videoId;
            dispatch(beginAjaxCall());
            return apiActions.getVideoInfo(videoId).then(video => {
                dispatch(getMostRecentUploadSuccess(video));
            });
        });
    };
}