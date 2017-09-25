import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function subscribersReducer(state = initialState.subscribers, action) {
    switch(action.type) {
        case types.GET_SUBSCRIBERS_SUCCESS:
            return action.report;
        case types.CLEAR_SUBSCRIBERS:
            return {};
        default:
            return state;
    }
}