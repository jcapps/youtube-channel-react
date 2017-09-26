import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';

export function loginSuccess(isLoggedIn) {
    return { type: types.LOGIN_SUCCESS, isLoggedIn };
}

export function loginError(error) {
    return { type: types.LOGIN_ERROR, error };
}

export function getIsLoggedInSuccess(isLoggedIn) {
    return { type: types.GET_IS_LOGGED_IN_SUCCESS, isLoggedIn };
}

export function getIsLoggedInError(error) {
    return { type: types.GET_IS_LOGGED_IN_ERROR, error };
}

export function login() {
    return function(dispatch) {
        dispatch(ajax.loggingIn());
        return analyticsActions.login().then(isLoggedIn => {
            dispatch(loginSuccess(isLoggedIn));
        }).catch(error => {
            dispatch(loginError(error));
        });
    };
}

export function isLoggedIn() {
    return function(dispatch) {
        dispatch(ajax.gettingIsLoggedIn());
        return analyticsActions.isLoggedIn().then(isLoggedIn => {
            dispatch(getIsLoggedInSuccess(isLoggedIn));
            return isLoggedIn;
        }).catch(error => {
            dispatch(getIsLoggedInError(error));
        });
    };
}