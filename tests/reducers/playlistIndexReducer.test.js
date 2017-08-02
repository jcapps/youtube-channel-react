import expect from 'expect';
import playlistIndexReducer from '../../src/reducers/playlistIndexReducer';
import * as videoTypes from '../../src/reducers/videoTypes';
import * as videoActions from '../../src/actions/videoActions';

describe('Playlist Index Reducer', () => {
    it('Should set playlistIndex when passed GET_VIDEO_SUCCESS with playlistIndex', () => {
        // arrange
        const initialState = 0;

        const video = {};
        const playlistIndex = 1;
        const action = videoActions.getVideoSuccess(video, videoTypes.CURRENT, playlistIndex);

        // act
        const newState = playlistIndexReducer(initialState, action);

        // assert
        expect(newState).toEqual(1);    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = 0;

        const playlistIndex = 1;
        const action = {type: 'DUMMY_ACTION_FAIL', playlistIndex};

        // act
        const newState = playlistIndexReducer(initialState, action);

        // assert
        expect(newState).toEqual(0);    
    });
});