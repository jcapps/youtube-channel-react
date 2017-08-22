import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated
});

export default rootReducer;