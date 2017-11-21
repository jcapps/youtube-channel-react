import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function playlistListReducer(state = initialState.playlistList, action) {
    switch(action.type) {
        case types.GET_PLAYLIST_INFO_SUCCESS:
            return action.playlistInfo.items;
        default:
            return state;
    }
}