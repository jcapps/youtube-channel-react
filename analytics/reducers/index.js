import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import channelInfo from './channelInfoReducer';
import comments from './commentsReducer';
import dislikes from './dislikesReducer';
import likes from './likesReducer';
import searchChannelResults from './searchChannelResultsReducer';
import searchPlaylistResults from './searchPlaylistResultsReducer';
import searchVideoResults from './searchVideoResultsReducer';
import totalStats from './totalStatsReducer';
import views from './viewsReducer';
import watchTime from './watchTimeReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    channelInfo,
    comments,
    dislikes,
    likes,
    searchChannelResults,
    searchPlaylistResults,
    searchVideoResults,
    totalStats,
    views,
    watchTime
});

export default rootReducer;