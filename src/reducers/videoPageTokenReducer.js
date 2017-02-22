import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function videoPageTokenReducer(state = initialState.videoPageToken, action) {
    switch(action.type) {
        case types.GET_PLAYLIST_SUCCESS:
            return {
                prevPageToken: action.playlist.prevPageToken,
                nextPageToken: action.playlist.nextPageToken
            };
        case types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS:
            return {
                prevPageToken: action.playlist.prevPageToken,
                nextPageToken: action.playlist.nextPageToken
            };
        case types.GET_NEXT_VIDEOS_SUCCESS:
            return {
                prevPageToken: action.playlist.prevPageToken,
                nextPageToken: action.playlist.nextPageToken
            };
        default:
            return state;
    }
}