import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import views from './viewsReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    views
});

export default rootReducer;