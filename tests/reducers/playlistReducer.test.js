import expect from 'expect';
import playlistReducer from '../../src/reducers/playlistReducer';
import * as playlistActions from '../../src/actions/playlistActions';

describe('Playlist Reducer', () => {
    it('Should set playlist when passed GET_PLAYLIST_SUCCESS', () => {
        // arrange
        const initialState = [];

        const playlist = {
            items: [{video: 'A'}, {video: 'B'}]
        };
        const action = playlistActions.getPlaylistSuccess(playlist);

        // act
        const newState = playlistReducer(initialState, action);

        // assert
        expect(newState).toEqual([{video: 'A'}, {video: 'B'}]);    
    });

    it('Should set playlist when passed GET_RECENT_UPLOADS_PLAYLIST_SUCCESS', () => {
        // arrange
        const initialState = [];

        const playlist = {
            items: [{video: 'A'}, {video: 'B'}]
        };
        const action = playlistActions.getRecentUploadsPlaylistSuccess(playlist);

        // act
        const newState = playlistReducer(initialState, action);

        // assert
        expect(newState).toEqual([{video: 'A'}, {video: 'B'}]);    
    });

    it('Should set playlist when passed GET_NEXT_VIDEOS_SUCCESS', () => {
        // arrange
        const initialState = [{video: 'A'}, {video: 'B'}];

        const playlist = {
            items: [{video: 'A'}, {video: 'B'}, {video: 'C'}]
        };
        const action = playlistActions.getNextVideosSuccess(playlist);

        // act
        const newState = playlistReducer(initialState, action);

        // assert
        expect(newState).toEqual([{video: 'A'}, {video: 'B'}, {video: 'C'}]);    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = [];

        const playlist = {
            items: [{video: 'A'}, {video: 'B'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', playlist};

        // act
        const newState = playlistReducer(initialState, action);

        // assert
        expect(newState).toEqual([]);    
    });
});