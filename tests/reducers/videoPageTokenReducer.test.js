import expect from 'expect';
import videoPageTokenReducer from '../../src/reducers/videoPageTokenReducer';
import * as playlistActions from '../../src/actions/playlistActions';
import clearStore from '../../src/actions/clearAction';

describe('Video Page Token Reducer', () => {
    it('Should set videoPageToken when passed GET_PLAYLIST_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlist = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = playlistActions.getPlaylistSuccess(playlist);

        // act
        const newState = videoPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });     
    });

    it('Should set videoPageToken when passed GET_RECENT_UPLOADS_PLAYLIST_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlist = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = playlistActions.getRecentUploadsPlaylistSuccess(playlist);

        // act
        const newState = videoPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });     
    });

    it('Should set videoPageToken when passed GET_NEXT_VIDEOS_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlist = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = playlistActions.getNextVideosSuccess(playlist);

        // act
        const newState = videoPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });     
    });

    it('Should clear videoPageToken when passed CLEAR_STORE', () => {
        // arrange
        const initialState = {prevPageToken: "XXXXX", nextPageToken: "YYYYY"};

        const action = clearStore();

        // act
        const newState = videoPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({prevPageToken: "", nextPageToken: ""});
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const playlist = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = {type: 'DUMMY_ACTION_FAIL', playlist};

        // act
        const newState = videoPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({prevPageToken: "", nextPageToken: ""});    
    });
});