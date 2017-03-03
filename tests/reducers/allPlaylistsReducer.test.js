import expect from 'expect';
import allPlaylistsReducer from '../../src/reducers/allPlaylistsReducer';
import * as playlistActions from '../../src/actions/playlistActions';

describe('All Playlists Reducer', () => {
    it('Should set allPlaylists when passed GET_ALL_PLAYLISTS_SUCCESS', () => {
        // arrange
        const initialState = [];

        const playlists = {
            items: [{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}]
        };
        const action = playlistActions.getAllPlaylistsSuccess(playlists);

        // act
        const newState = allPlaylistsReducer(initialState, action);

        // assert
        expect(newState).toEqual([{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}]);    
    });

    it('Should set allPlaylists when passed GET_NEXT_PLAYLISTS_SUCCESS', () => {
        // arrange
        const initialState = [{playlist: 'A'}, {playlist: 'B'}];

        const playlists = {
            items: [{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}]
        };
        const action = playlistActions.getNextPlaylistsSuccess(playlists);

        // act
        const newState = allPlaylistsReducer(initialState, action);

        // assert
        expect(newState).toEqual([{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}]);    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = [];

        const playlists = {
            items: [{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', playlists};

        // act
        const newState = allPlaylistsReducer(initialState, action);

        // assert
        expect(newState).toEqual([]);    
    });
});