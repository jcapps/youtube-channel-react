import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import error from './errorReducer';
import filterState from './filterStateReducer';
import graphType from './graphTypeReducer';
import channelInfo from './channelInfoReducer';
import playlistInfo from './playlistInfoReducer';
import report from './reportReducer';
import searchChannelResults from './searchChannelResultsReducer';
import searchPlaylistResults from './searchPlaylistResultsReducer';
import searchVideoResults from './searchVideoResultsReducer';
import topResultsReport from './topResultsReportReducer';
import totalStats from './totalStatsReducer';
import video from './videoReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    error,
    filterState,
    graphType,
    channelInfo,
    playlistInfo,
    report,
    searchChannelResults,
    searchPlaylistResults,
    searchVideoResults,
    topResultsReport,
    totalStats,
    video
});

export default rootReducer;