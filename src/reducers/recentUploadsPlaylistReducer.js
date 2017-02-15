import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function recentUploadsPlaylistReducer(state = initialState.recentUploadsPlaylist, action) {
    switch(action.type) {
        case types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS:
            return action.playlist;
        default:
            return state;
    }
}