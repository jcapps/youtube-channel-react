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
            return youtubeActions.getVideoStats(id).then(videoStats => {
                const combinedInfo = Object.assign(video.items[0], videoStats.items[0]);
                const newVideo = {items: [combinedInfo]}
                dispatch(getVideoSuccess(newVideo));
            });
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
                return youtubeActions.getVideoStats(videoId).then(videoStats => {
                    const combinedInfo = Object.assign(video.items[0], videoStats.items[0]);
                    const newVideo = {items: [combinedInfo]}
                    dispatch(getMostRecentUploadSuccess(newVideo));
                });
            });
        });
    };
}