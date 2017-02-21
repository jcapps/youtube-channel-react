import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import mostRecentUpload from './mostRecentUploadReducer';
import recentUploadsPlaylist from './recentUploadsPlaylistReducer';
import allPlaylists from './allPlaylistsReducer';
import playlistPageToken from './playlistPageTokenReducer';
import videoPageToken from './videoPageTokenReducer';
import playlist from './playlistReducer';
import playlistInfo from './playlistInfoReducer';
import video from './videoReducer';
import videoInPlaylist from './videoInPlaylistReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    mostRecentUpload,
    recentUploadsPlaylist,
    allPlaylists,
    playlistPageToken,
    videoPageToken,
    playlist,
    playlistInfo,
    video,
    videoInPlaylist
});

export default rootReducer;