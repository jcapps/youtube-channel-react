import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import isAuthenticated from './isAuthenticatedReducer';
import error from './errorReducer';
import channelInfo from './channelInfoReducer';
import comments from './commentsReducer';
import dislikes from './dislikesReducer';
import likes from './likesReducer';
import revenue from './revenueReducer';
import adRevenue from './adRevenueReducer';
import youtubeRedRevenue from './youtubeRedRevenueReducer';
import searchChannelResults from './searchChannelResultsReducer';
import searchPlaylistResults from './searchPlaylistResultsReducer';
import searchVideoResults from './searchVideoResultsReducer';
import shares from './sharesReducer';
import subscribers from './subscribersReducer';
import unsubscribers from './unsubscribersReducer';
import totalStats from './totalStatsReducer';
import views from './viewsReducer';
import watchTime from './watchTimeReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    isAuthenticated,
    error,
    channelInfo,
    comments,
    dislikes,
    likes,
    revenue,
    adRevenue,
    youtubeRedRevenue,
    searchChannelResults,
    searchPlaylistResults,
    searchVideoResults,
    shares,
    subscribers,
    unsubscribers,
    totalStats,
    views,
    watchTime
});

export default rootReducer;