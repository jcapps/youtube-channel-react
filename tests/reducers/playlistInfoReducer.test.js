import expect from 'expect';
import playlistInfoReducer from '../../src/reducers/playlistInfoReducer';
import * as playlistActions from '../../src/actions/playlistActions';
import clearStore from '../../src/actions/clearAction';

describe('Playlist Info Reducer', () => {
    it('Should set playlistInfo when passed GET_PLAYLIST_INFO_SUCCESS', () => {
        // arrange
        const initialState = {};

        const playlistInfo = {
            items: [{id: 'XXXXX'}]
        };
        const action = playlistActions.getPlaylistInfoSuccess(playlistInfo);

        // act
        const newState = playlistInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({id: 'XXXXX'});    
    });

    it('Should clear playlistInfo when passed CLEAR_STORE', () => {
        // arrange
        const initialState = {items: [{id: 'XXXXX'}]};

        const action = clearStore();

        // act
        const newState = playlistInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({});
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {};

        const playlistInfo = {
            items: [{id: 'XXXXX'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', playlistInfo};

        // act
        const newState = playlistInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({});    
    });
});