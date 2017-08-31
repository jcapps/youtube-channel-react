import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import channelInfo from './channelInfoReducer';
import searchResults from './searchResultsReducer';
import views from './viewsReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    channelInfo,
    searchResults,
    views
});

export default rootReducer;