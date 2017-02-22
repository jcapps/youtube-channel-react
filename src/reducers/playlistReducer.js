import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function playlistReducer(state = initialState.playlist, action) {
    switch(action.type) {
        case types.GET_PLAYLIST_SUCCESS:
            return action.playlist.items;
        case types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS:
            return action.playlist.items;
        case types.GET_NEXT_VIDEOS_SUCCESS:
            return action.playlist.items;
        default:
            return state;
    }
}