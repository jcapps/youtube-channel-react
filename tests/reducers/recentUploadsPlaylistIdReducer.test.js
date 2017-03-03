import expect from 'expect';
import recentUploadsPlaylistIdReducer from '../../src/reducers/recentUploadsPlaylistIdReducer';
import * as playlistActions from '../../src/actions/playlistActions';

describe('Recent Uploads Playlist ID Reducer', () => {
    it('Should set recentUploadsPlaylistId when passed GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS', () => {
        // arrange
        const initialState = '';

        const playlistId = 'XXXXX';
        const action = playlistActions.getRecentUploadsPlaylistIdSuccess(playlistId);

        // act
        const newState = recentUploadsPlaylistIdReducer(initialState, action);

        // assert
        expect(newState).toEqual('XXXXX');    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = '';

        const playlistId = 'XXXXX';
        const action = {type: 'DUMMY_ACTION_FAIL', playlistId};

        // act
        const newState = recentUploadsPlaylistIdReducer(initialState, action);

        // assert
        expect(newState).toEqual('');
    });
});