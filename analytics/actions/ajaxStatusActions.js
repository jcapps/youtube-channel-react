import * as types from './actionTypes';

export function loggingIn() {
    return {type: types.LOGGING_IN};
}

export function gettingIsLoggedIn() {
    return {type: types.GETTING_IS_LOGGED_IN};
}