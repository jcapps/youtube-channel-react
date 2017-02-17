import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function videoReducer(state = initialState.video, action) {
    switch(action.type) {
        case types.GET_VIDEO_SUCCESS:
            return action.video;
        default:
            return state;
    }
}