import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import channelInfo from './channelInfoReducer';
import searchChannelResults from './searchChannelResultsReducer';
import searchPlaylistResults from './searchPlaylistResultsReducer';
import searchVideoResults from './searchVideoResultsReducer';
import totalStats from './totalStatsReducer';
import views from './viewsReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    channelInfo,
    searchChannelResults,
    searchPlaylistResults,
    searchVideoResults,
    totalStats,
    views
});

export default rootReducer;