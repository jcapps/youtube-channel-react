import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function unsubscribersReducer(state = initialState.unsubscribers, action) {
    switch(action.type) {
        case types.GET_UNSUBSCRIBERS_SUCCESS:
            return action.report;
        case types.CLEAR_UNSUBSCRIBERS:
            return {};
        default:
            return state;
    }
}