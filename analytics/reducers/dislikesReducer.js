import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function dislikesReducer(state = initialState.dislikes, action) {
    switch(action.type) {
        case types.GET_DISLIKES_SUCCESS:
            return action.report;
        case types.CLEAR_DISLIKES:
            return {};
        default:
            return state;
    }
}