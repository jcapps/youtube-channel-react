import * as types from './actionTypes';

export function gettingChannelInfo() {
    return {type: types.GETTING_CHANNEL_INFO};
}

export function searchingChannel() {
    return {type: types.SEARCHING_CHANNEL};
}

export function gettingVideoComments() {
    return {type: types.GETTING_VIDEO_COMMENTS};
}

export function gettingCommentReplies() {
    return {type: types.GETTING_COMMENT_REPLIES};
}

export function gettingAllPlaylists() {
    return {type: types.GETTING_ALL_PLAYLISTS};
}

export function gettingPlaylist() {
    return {type: types.GETTING_PLAYLIST};
}

export function gettingPlaylistInfo() {
    return {type: types.GETTING_PLAYLIST_INFO};
}

export function gettingRecentUploadsPlaylist() {
    return {type: types.GETTING_RECENT_UPLOADS_PLAYLIST};
}

export function gettingRecentUploadsPlaylistId() {
    return {type: types.GETTING_RECENT_UPLOADS_PLAYLIST_ID};
}

export function gettingVideoInfo() {
    return {type: types.GETTING_VIDEO_INFO};
}

export function gettingMostRecentUpload() {
    return {type: types.GETTING_MOST_RECENT_UPLOAD};
}