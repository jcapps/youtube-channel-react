import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function likesReducer(state = initialState.likes, action) {
    switch(action.type) {
        case types.GET_LIKES_SUCCESS:
            return action.report;
        case types.CLEAR_LIKES:
            return {};
        default:
            return state;
    }
}