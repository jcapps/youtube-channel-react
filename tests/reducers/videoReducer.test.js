import expect from 'expect';
import videoReducer from '../../src/reducers/videoReducer';
import * as videoActions from '../../src/actions/videoActions';

describe('Video Reducer', () => {
    it('Should set video when passed GET_VIDEO_SUCCESS', () => {
        // arrange
        const initialState = {};

        const video = {
            items: [{id: 'XXXXX'}]
        };
        const action = videoActions.getVideoSuccess(video);

        // act
        const newState = videoReducer(initialState, action);

        // assert
        expect(newState).toEqual({id: 'XXXXX'});    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {};

        const video = {
            items: [{id: 'XXXXX'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', video};

        // act
        const newState = videoReducer(initialState, action);

        // assert
        expect(newState).toEqual({});    
    });
});