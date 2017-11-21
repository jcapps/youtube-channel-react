import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function videoListReducer(state = initialState.videoList, action) {
    switch(action.type) {
        case types.GET_VIDEO_SUCCESS:
            return action.video.items;
        default:
            return state;
    }
}