import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import channelInfo from './channelInfoReducer';
import subscribeSuccess from './subscribeSuccessReducer';
import mostRecentUpload from './mostRecentUploadReducer';
import recentUploadsPlaylistId from './recentUploadsPlaylistIdReducer';
import allPlaylists from './allPlaylistsReducer';
import playlistPageToken from './playlistPageTokenReducer';
import videoPageToken from './videoPageTokenReducer';
import playlist from './playlistReducer';
import playlistInfo from './playlistInfoReducer';
import video from './videoReducer';
import videoInPlaylist from './videoInPlaylistReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    channelInfo,
    subscribeSuccess,
    mostRecentUpload,
    recentUploadsPlaylistId,
    allPlaylists,
    playlistPageToken,
    videoPageToken,
    playlist,
    playlistInfo,
    video,
    videoInPlaylist
});

export default rootReducer;