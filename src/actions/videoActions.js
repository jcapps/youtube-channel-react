import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as playlistActions from './playlistActions';
import * as youtubeActions from './youtubeActions';

export function getVideoSuccess(video, videoType, playlistIndex) {
    return { type: types.GET_VIDEO_SUCCESS, video, videoType, playlistIndex };
}

export function getMostRecentUploadSuccess(video) {
    return { type: types.GET_MOST_RECENT_UPLOAD_SUCCESS, video };
}

export function getVideo(id, type, playlistIndex = 0) {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return youtubeActions.getVideoInfo(id).then(video => {
            dispatch(getVideoSuccess(video, type, playlistIndex));
        });
    };
}

export function getMostRecentUpload() {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        const helperActions = bindActionCreators(playlistActions, dispatch);

        return helperActions.getRecentUploadsPlaylist().then(playlist => {
            let videoId = playlist.items[0].snippet.resourceId.videoId;
            return youtubeActions.getVideoInfo(videoId).then(video => {
                dispatch(getMostRecentUploadSuccess(video));
            });
        });
    };
}