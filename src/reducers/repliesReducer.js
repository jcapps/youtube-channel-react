import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function repliesReducer(state = initialState.replies, action) {
    switch(action.type) {
        case types.GET_REPLIES_SUCCESS:
            return action.replies;
        case types.GET_NEXT_REPLIES_SUCCESS:
            return action.replies;
        case types.CLEAR_STORE:
            return {};
        default:
            return state;
    }
}