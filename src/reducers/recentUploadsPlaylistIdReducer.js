import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function recentUploadsPlaylistIdReducer(state = initialState.recentUploadsPlaylistId, action) {
    switch(action.type) {
        case types.GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS:
            return action.playlistId;
        default:
            return state;
    }
}