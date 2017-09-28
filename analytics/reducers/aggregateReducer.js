import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function aggregateReducer(state = initialState.aggregate, action) {
    let currentState = Object.assign({}, state);

    switch(action.type) {
        case types.GET_AGGREGATE_PLAYLIST_SUCCESS:
            currentState.playlist = action.report;
            return currentState;
        case types.GET_AGGREGATE_VIDEO_SUCCESS:
            currentState.video = action.report;
            return currentState;
        case types.CLEAR_AGGREGATE_PLAYLIST:
            currentState.playlist = {};
            return currentState;
        case types.CLEAR_AGGREGATE_VIDEO:
            currentState.video = {};
            return currentState;
        default:
            return currentState;
    }
}