import * as types from '../actions/actionTypes';
import * as videoTypes from './videoTypes';
import initialState from './initialState';

export default function videoReducer(state = initialState.video, action) {
    switch(action.type) {
        case types.GET_VIDEO_SUCCESS: {
            switch(action.videoType) {
                case videoTypes.CURRENT: {
                    return {
                        current: action.video.items[0],
                        queued: state.queued
                    };
                }
                case videoTypes.QUEUED: {
                    return {
                        current: state.current,
                        queued: action.video.items
                    };
                }
                default: {
                    return state;
                }
            }
        }
        case types.CLEAR_STORE:
            return {current: {}, queued: []};
        default:
            return state;
    }
}