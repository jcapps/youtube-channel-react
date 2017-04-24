import * as types from './actionTypes';
import YouTubeApi from '../api/YouTubeApi';

/**
 * Retrieve information about the YouTube channel
 * (Contains channel name, description, profile image)
 */
export function getChannelInfo() {
    return YouTubeApi.getChannelInfo().then(channelInfo => {
        return channelInfo;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Retrieve YouTube channel details
 * (Contains info about related playlists such as 
 * uploads, watch history, and watch later)
 */
export function getChannelDetails() {
    return YouTubeApi.getChannelDetails().then(channelContent => {
        return channelContent;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Retrieve list of all playlists
 */
export function getAllPlaylists(pageToken = "") {
    return YouTubeApi.getAllPlaylists(pageToken).then(playlists => {
        return playlists;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Retrieve videos in a playlist given the playlist ID
 */
export function getPlaylist(playlistId, pageToken = "") {
    return YouTubeApi.getPlaylist(playlistId, pageToken).then(playlist => {
        return playlist;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Retrieve playlist information given the playlist ID
 */
export function getPlaylistInfo(playlistId) {
    return YouTubeApi.getPlaylistInfo(playlistId).then(playlistInfo => {
        return playlistInfo;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Retrieve video information given its ID
 */
export function getVideoInfo(videoId) {
    return YouTubeApi.getVideo(videoId).then(video => {
        return video;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Retrieve video statistics given its ID
 */
export function getVideoStats(videoId) {
    return YouTubeApi.getVideoStats(videoId).then(video => {
        return video;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Search channel for playlists/videos given a search query
 */
export function searchChannel(query, pageToken = "") {
    return YouTubeApi.search(query, pageToken).then(result => {
        return result;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Subscribe
 */
export function subscribe() {
    return YouTubeApi.subscribe().then(() => {
        return;
    }).catch(error => {
        throw(error);
    });
}