import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function watchTimeReducer(state = initialState.watchTime, action) {
    switch(action.type) {
        case types.GET_WATCH_TIME_SUCCESS:
            return action.report;
        default:
            return state;
    }
}