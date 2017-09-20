import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function commentsReducer(state = initialState.comments, action) {
    switch(action.type) {
        case types.GET_COMMENTS_SUCCESS:
            return action.report;
        case types.CLEAR_COMMENTS:
            return {};
        default:
            return state;
    }
}