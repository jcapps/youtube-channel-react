import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as playlistActions from './playlistActions';
import * as youtubeActions from './youtubeActions';

export function getVideoSuccess(video) {
    return { type: types.GET_VIDEO_SUCCESS, video };
}

export function getMostRecentUploadSuccess(video) {
    return { type: types.GET_MOST_RECENT_UPLOAD_SUCCESS, video };
}

export function getVideo(id) {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return youtubeActions.getVideoInfo(id).then(video => {
            dispatch(getVideoSuccess(video));
        });
    };
}

export function getMostRecentUpload() {
    return function(dispatch) {
        const helperActions = bindActionCreators(playlistActions, dispatch);

        dispatch(beginAjaxCall());
        return helperActions.getRecentUploadsPlaylist().then(playlist => {
            let videoId = playlist.items[0].snippet.resourceId.videoId;
            return youtubeActions.getVideoInfo(videoId).then(video => {
                dispatch(getMostRecentUploadSuccess(video));
            });
        });
    };
}