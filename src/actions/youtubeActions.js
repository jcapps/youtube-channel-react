import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import YouTubeApi from '../api/YouTubeApi';

/**
 * Retrieve information about the YouTube channel
 * (Contains channel name, description, profile image)
 */
export function getChannelInfo() {
    return function(dispatch) {
        return YouTubeApi.getChannelInfo().then(channelInfo => {
            return channelInfo;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve YouTube channel details
 * (Contains info about related playlists such as 
 * uploads, watch history, and watch later)
 */
export function getChannelDetails() {
    return function(dispatch) {
        return YouTubeApi.getChannelDetails().then(channelContent => {
            return channelContent;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve list of all playlists
 */
export function getAllPlaylists(pageToken = "") {
    return function(dispatch) {
        return YouTubeApi.getAllPlaylists(pageToken).then(playlists => {
            return playlists;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve videos in a playlist given the playlist ID
 */
export function getPlaylist(playlistId, pageToken = "") {
    return function(dispatch) {
        return YouTubeApi.getPlaylist(playlistId, pageToken).then(playlist => {
            return playlist;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve playlist information given the playlist ID
 */
export function getPlaylistInfo(playlistId) {
    return function(dispatch) {
        return YouTubeApi.getPlaylistInfo(playlistId).then(playlist => {
            return playlist;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve video information given its ID
 */
export function getVideoInfo(videoId) {
    return function(dispatch) {
        return YouTubeApi.getVideo(videoId).then(video => {
            return video;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Subscribe
 */
export function subscribe() {
    return function(dispatch) {
        return YouTubeApi.subscribe().then(() => {
            return;
        }).catch(error => {
            throw(error);
        });
    };
}