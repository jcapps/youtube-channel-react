import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function playlistIndexReducer(state = initialState.playlistIndex, action) {
    switch(action.type) {
        case types.GET_VIDEO_SUCCESS:
            return action.playlistIndex;
        default:
            return state;
    }
}