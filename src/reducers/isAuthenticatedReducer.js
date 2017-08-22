import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function isAuthenticatedReducer(state = initialState.isAuthenticated, action) {
    switch(action.type) {
        case types.LOGIN_SUCCESS:
            return action.isLoggedIn;
        case types.GET_IS_LOGGED_IN_SUCCESS:
            return action.isLoggedIn;
        default:
            return state;
    }
}