import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import YouTubeApi from '../api/YouTubeApi';

/**
 * Retrieve information about the YouTube channel
 * (Contains info about related playlists such as 
 * uploads, watch history, and watch later)
 */
export function getChannelInfo() {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getChannelInfo().then(channelInfo => {
            return channelInfo.items[0];
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve YouTube channel content
 * (Contains channel name, description, profile image)
 */
export function getChannelContent() {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getChannelContent().then(channelContent => {
            return channelContent.items[0];
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve list of all playlists
 */
export function getAllPlaylists(nextPageToken = "") {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getAllPlaylists(nextPageToken).then(playlists => {
            return playlists;
        }).catch(error => {
            throw(error);
        });
    };
}

/**
 * Retrieve videos in a playlist given the playlist ID
 */
export function getPlaylist(playlistId) {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return YouTubeApi.getPlaylist(playlistId).then(playlist => {
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
        dispatch(beginAjaxCall());
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
        dispatch(beginAjaxCall());
        return YouTubeApi.getVideo(videoId).then(video => {
            return video;
        }).catch(error => {
            throw(error);
        });
    };
}