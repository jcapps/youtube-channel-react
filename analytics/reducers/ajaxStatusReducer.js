import * as types from '../actions/actionTypes';
import initialState from './initialState';

function isLoginActionStartingType(type) {
    return (
        type == types.LOGGING_IN ||
        type == types.GETTING_IS_LOGGED_IN
    );
}

function isLoginActionSuccessType(type) {
    return (
        type == types.LOGIN_SUCCESS || 
        type == types.GET_IS_LOGGED_IN_SUCCESS
    );
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    let currentState = Object.assign({}, state);

    if (isLoginActionStartingType(action.type)) {
        currentState.login += 1;
    }
    if (isLoginActionSuccessType(action.type)) {
        currentState.login -= 1;
    }

    return currentState;
}