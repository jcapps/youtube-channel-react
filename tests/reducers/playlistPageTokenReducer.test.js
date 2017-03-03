import expect from 'expect';
import playlistPageTokenReducer from '../../src/reducers/playlistPageTokenReducer';
import * as playlistActions from '../../src/actions/playlistActions';

describe('Playlist Page Token Reducer', () => {
    it('Should set playlistPageToken when passed GET_ALL_PLAYLISTS_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlists = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = playlistActions.getAllPlaylistsSuccess(playlists);

        // act
        const newState = playlistPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });    
    });

    it('Should set playlistPageToken when passed GET_NEXT_PLAYLISTS_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlists = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = playlistActions.getNextPlaylistsSuccess(playlists);

        // act
        const newState = playlistPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlists = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = {type: 'DUMMY_ACTION_FAIL', playlists};

        // act
        const newState = playlistPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({prevPageToken: "", nextPageToken: ""});    
    });
});