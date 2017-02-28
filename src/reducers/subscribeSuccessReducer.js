import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function subscribeSuccessReducer(state = initialState.subscribeSuccess, action) {
    switch(action.type) {
        case types.SUBSCRIBE_SUCCESS:
            return action.success;
        default:
            return state;
    }
}