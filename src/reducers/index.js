import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import mostRecentUpload from './mostRecentUploadReducer';
import recentUploadsPlaylist from './recentUploadsPlaylistReducer';
import allPlaylists from './allPlaylistsReducer';

const rootReducer = combineReducers({
    ajaxCallsInProgress,
    mostRecentUpload,
    recentUploadsPlaylist,
    allPlaylists
});

export default rootReducer;