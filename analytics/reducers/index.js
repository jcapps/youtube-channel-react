import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import error from './errorReducer';
import channelInfo from './channelInfoReducer';
import report from './reportReducer';
import searchChannelResults from './searchChannelResultsReducer';
import searchPlaylistResults from './searchPlaylistResultsReducer';
import searchVideoResults from './searchVideoResultsReducer';
import totalStats from './totalStatsReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    error,
    channelInfo,
    report,
    searchChannelResults,
    searchPlaylistResults,
    searchVideoResults,
    totalStats
});

export default rootReducer;