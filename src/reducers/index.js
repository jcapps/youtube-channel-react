import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import channelInfo from './channelInfoReducer';
import mostRecentUpload from './mostRecentUploadReducer';
import recentUploadsPlaylistId from './recentUploadsPlaylistIdReducer';
import allPlaylists from './allPlaylistsReducer';
import playlistPageToken from './playlistPageTokenReducer';
import videoPageToken from './videoPageTokenReducer';
import playlist from './playlistReducer';
import playlistInfo from './playlistInfoReducer';
import video from './videoReducer';
import comments from './commentsReducer';
import replies from './repliesReducer';
import searchResults from './searchResultsReducer';
import searchInfo from './searchInfoReducer';
import searchPageToken from './searchPageTokenReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    channelInfo,
    mostRecentUpload,
    recentUploadsPlaylistId,
    allPlaylists,
    comments,
    replies,
    playlistPageToken,
    videoPageToken,
    playlist,
    playlistInfo,
    video,
    searchResults,
    searchInfo,
    searchPageToken
});

export default rootReducer;