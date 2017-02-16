import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function allPlaylistsReducer(state = initialState.playlist, action) {
    switch(action.type) {
        case types.GET_PLAYLIST_SUCCESS:
            return action.playlist;
        default:
            return state;
    }
}