import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import mostRecentUpload from './mostRecentUploadReducer';
import recentUploadsPlaylist from './recentUploadsPlaylistReducer';
import allPlaylists from './allPlaylistsReducer';
import playlist from './playlistReducer';
import video from './videoReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    mostRecentUpload,
    recentUploadsPlaylist,
    allPlaylists,
    playlist,
    video
});

export default rootReducer;