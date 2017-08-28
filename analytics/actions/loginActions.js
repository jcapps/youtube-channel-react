import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';

export function loginSuccess(isLoggedIn) {
    return { type: types.LOGIN_SUCCESS, isLoggedIn };
}

export function getIsLoggedInSuccess(isLoggedIn) {
    return { type: types.GET_IS_LOGGED_IN_SUCCESS, isLoggedIn };
}

export function login() {
    return function(dispatch) {
        dispatch(ajax.loggingIn());
        return analyticsActions.login().then(isLoggedIn => {
            dispatch(loginSuccess(isLoggedIn));
        }).catch(error => {
            throw(error);
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
            throw(error);
        });
    };
}