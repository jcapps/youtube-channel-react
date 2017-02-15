import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import YouTubeApi from '../api/YouTubeApi';

export function getChannelInfo() {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getChannelInfo().then(channelInfo => {
            return channelInfo;
        }).catch(error => {
            throw(error);
        });
    };
}

export function getPlaylistInfo(playlistId) {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getPlaylist(playlistId).then(playlist => {
            return playlist;
        }).catch(error => {
            throw(error);
        });
    };
}

export function getVideoInfo(videoId) {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getVideo(videoId).then(video => {
            return video;
        }).catch(error => {
            throw(error);
        });
    };
}