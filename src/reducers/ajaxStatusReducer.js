import * as types from '../actions/actionTypes';
import initialState from './initialState';

function isAboutActionStartingType(type) {
    return (
        type == types.GETTING_CHANNEL_INFO
    );
}

function isAboutActionSuccessType(type) {
    return (
        type == types.GET_CHANNEL_INFO_SUCCESS
    );
}

function isAllPlaylistsActionStartingType(type) {
    return (
        type == types.GETTING_ALL_PLAYLISTS
    );
}

function isAllPlaylistsActionSuccessType(type) {
    return (
        type == types.GET_ALL_PLAYLISTS_SUCCESS ||
        type == types.GET_NEXT_PLAYLISTS_SUCCESS
    );
}

function isAllVideosActionStartingType(type) {
    return (
        type == types.GETTING_RECENT_UPLOADS_PLAYLIST_ID ||
        type == types.GETTING_RECENT_UPLOADS_PLAYLIST ||
        type == types.GETTING_PLAYLIST
    );
}

function isAllVideosActionSuccessType(type) {
    return (
        type == types.GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS ||
        type == types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS ||
        type == types.GET_PLAYLIST_SUCCESS ||
        type == types.GET_NEXT_VIDEOS_SUCCESS
    );
}

function isCommentsActionStartingType(type) {
    return (
        type == types.GETTING_VIDEO_COMMENTS
    );
}

function isCommentsActionSuccessType(type) {
    return (
        type == types.GET_COMMENTS_SUCCESS ||
        type == types.GET_NEXT_COMMENTS_SUCCESS
    );
}

function isHeaderActionStartingType(type) {
    return (
        type == types.GETTING_CHANNEL_INFO ||
        type == types.GETTING_ALL_PLAYLISTS
    );
}

function isHeaderActionSuccessType(type) {
    return (
        type == types.GET_CHANNEL_INFO_SUCCESS ||
        type == types.GET_ALL_PLAYLISTS_SUCCESS ||
        type == types.GET_NEXT_PLAYLISTS_SUCCESS
    );
}

function isHomeActionStartingType(type) {
    return (
        type == types.GETTING_RECENT_UPLOADS_PLAYLIST_ID ||
        type == types.GETTING_RECENT_UPLOADS_PLAYLIST ||
        type == types.GETTING_MOST_RECENT_UPLOAD
    );
}

function isHomeActionSuccessType(type) {
    return (
        type == types.GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS ||
        type == types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS ||
        type == types.GET_MOST_RECENT_UPLOAD_SUCCESS
    );
}

function isPlaylistActionStartingType(type) {
    return (
        type == types.GETTING_PLAYLIST_INFO ||
        type == types.GETTING_PLAYLIST
    );
}

function isPlaylistActionSuccessType(type) {
    return (
        type == types.GET_PLAYLIST_INFO_SUCCESS ||
        type == types.GET_PLAYLIST_SUCCESS ||
        type == types.GET_NEXT_VIDEOS_SUCCESS
    );
}

function isRepliesActionStartingType(type) {
    return (
        type == types.GETTING_COMMENT_REPLIES
    );
}

function isRepliesActionSuccessType(type) {
    return (
        type == types.GET_REPLIES_SUCCESS ||
        type == types.GET_NEXT_REPLIES_SUCCESS
    );
}

function isSearchResultsActionStartingType(type) {
    return (
        type == types.SEARCHING_CHANNEL ||
        type == types.GETTING_VIDEO_INFO
    );
}

function isSearchResultsActionSuccessType(type) {
    return (
        type == types.GET_SEARCH_RESULTS_SUCCESS ||
        type == types.GET_NEXT_RESULTS_SUCCESS ||
        type == types.GET_VIDEO_SUCCESS
    );
}

function isWatchActionStartingType(type) {
    return (
        type == types.GETTING_VIDEO_INFO
    );
}

function isWatchActionSuccessType(type) {
    return (
        type == types.GET_VIDEO_SUCCESS
    );
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    let currentState = Object.assign({}, state);

    if (isAboutActionStartingType(action.type)) {
        currentState.about += 1;
    }
    if (isAboutActionSuccessType(action.type)) {
        currentState.about -= 1;
    }
    if (isAllPlaylistsActionStartingType(action.type)) {
        currentState.allPlaylists += 1;
    }
    if (isAllPlaylistsActionSuccessType(action.type)) {
        currentState.allPlaylists -= 1;
    }
    if (isAllVideosActionStartingType(action.type)) {
        currentState.allVideos += 1;
    }
    if (isAllVideosActionSuccessType(action.type)) {
        currentState.allVideos -= 1;
    }
    if (isCommentsActionStartingType(action.type)) {
        currentState.comments += 1;
    }
    if (isCommentsActionSuccessType(action.type)) {
        currentState.comments -= 1;
    }
    if (isHeaderActionStartingType(action.type)) {
        currentState.header += 1;
    }
    if (isHeaderActionSuccessType(action.type)) {
        currentState.header -= 1;
    }
    if (isHomeActionStartingType(action.type)) {
        currentState.home += 1;
    }
    if (isHomeActionSuccessType(action.type)) {
        currentState.home -= 1;
    }
    if (isPlaylistActionStartingType(action.type)) {
        currentState.playlist += 1;
    }
    if (isPlaylistActionSuccessType(action.type)) {
        currentState.playlist -= 1;
    }
    if (isRepliesActionStartingType(action.type)) {
        currentState.replies += 1;
    }
    if (isRepliesActionSuccessType(action.type)) {
        currentState.replies -= 1;
    }
    if (isSearchResultsActionStartingType(action.type)) {
        currentState.searchResults += 1;
    }
    if (isSearchResultsActionSuccessType(action.type)) {
        currentState.searchResults -= 1;
    }
    if (isWatchActionStartingType(action.type)) {
        currentState.watch += 1;
    }
    if (isWatchActionSuccessType(action.type)) {
        currentState.watch -= 1;
    }

    return currentState;
}