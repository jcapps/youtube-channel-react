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

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    channelInfo,
    mostRecentUpload,
    recentUploadsPlaylistId,
    allPlaylists,
    playlistPageToken,
    videoPageToken,
    playlist,
    playlistInfo,
    video
});

export default rootReducer;