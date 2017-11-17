import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function playlistInfoReducer(state = initialState.playlistInfo, action) {
    switch(action.type) {
        case types.GET_PLAYLIST_INFO_SUCCESS:
            return action.playlistInfo.items[0];
        default:
            return state;
    }
}