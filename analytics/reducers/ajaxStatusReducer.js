import * as types from '../actions/actionTypes';
import initialState from './initialState';

function isChannelActionStartingType(type) {
    return (
        type == types.GETTING_CHANNEL_INFO
    );
}

function isChannelActionSuccessType(type) {
    return (
        type == types.GET_CHANNEL_INFO_SUCCESS
    );
}

function isCheckingLoginActionStartingType(type) {
    return (
        type == types.GETTING_IS_LOGGED_IN
    );
}

function isCheckingLoginActionSuccessType(type) {
    return (
        type == types.GET_IS_LOGGED_IN_SUCCESS
    );
}

function isLoginActionStartingType(type) {
    return (
        type == types.LOGGING_IN
    );
}

function isLoginActionSuccessType(type) {
    return (
        type == types.LOGIN_SUCCESS
    );
}

function isViewsActionStartingType(type) {
    return (
        type == types.GETTING_VIEWS
    );
}

function isViewsActionSuccessType(type) {
    return (
        type == types.GET_VIEWS_SUCCESS
    );
}

function isViewsActionErrorType(type) {
    return (
        type == types.GET_VIEWS_ERROR
    );
}

export default function ajaxStatusReducer(state = initialState.ajaxCallsInProgress, action) {
    let currentState = Object.assign({}, state);

    if (isChannelActionStartingType(action.type)) {
        currentState.channel += 1;
    }
    if (isChannelActionSuccessType(action.type)) {
        currentState.channel -= 1;
    }
    if (isCheckingLoginActionStartingType(action.type)) {
        currentState.isLoggedIn += 1;
    }
    if (isCheckingLoginActionSuccessType(action.type)) {
        currentState.isLoggedIn -= 1;
    }
    if (isLoginActionStartingType(action.type)) {
        currentState.login += 1;
    }
    if (isLoginActionSuccessType(action.type)) {
        currentState.login -= 1;
    }
    if (isViewsActionStartingType(action.type)) {
        currentState.views += 1;
    }
    if (isViewsActionSuccessType(action.type)) {
        currentState.views -= 1;
    }
    if (isViewsActionErrorType(action.type)) {
        currentState.views -= 1;
    }

    return currentState;
}