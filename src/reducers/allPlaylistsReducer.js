import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function allPlaylistsReducer(state = initialState.allPlaylists, action) {
    switch(action.type) {
        case types.GET_ALL_PLAYLISTS_SUCCESS:
            return action.playlists;
        default:
            return state;
    }
}