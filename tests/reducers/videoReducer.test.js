import expect from 'expect';
import videoReducer from '../../src/reducers/videoReducer';
import * as videoTypes from '../../src/reducers/videoTypes';
import * as videoActions from '../../src/actions/videoActions';
import clearStore from '../../src/actions/clearAction';

describe('Video Reducer', () => {
    it('Should set video when passed GET_VIDEO_SUCCESS for CURRENT video', () => {
        // arrange
        const initialState = {current: {}, queued: []};

        const video = {
            items: [{id: 'XXXXX'}]
        };
        const action = videoActions.getVideoSuccess(video, videoTypes.CURRENT);

        // act
        const newState = videoReducer(initialState, action);

        // assert
        expect(newState).toEqual({current: {id: 'XXXXX'}, queued: []});    
    });

    it('Should set video when passed GET_VIDEO_SUCCESS for QUEUED video', () => {
        // arrange
        const initialState = {current: {}, queued: []};

        const video = {
            items: [{id: 'XXXXX'}]
        };
        const action = videoActions.getVideoSuccess(video, videoTypes.QUEUED);

        // act
        const newState = videoReducer(initialState, action);

        // assert
        expect(newState).toEqual({current: {}, queued: [{id: 'XXXXX'}]});    
    });

    it('Should clear video when passed CLEAR_STORE', () => {
        // arrange
        const initialState = {current: {id: 'XXXXX'}, queued: []};

        const action = clearStore();

        // act
        const newState = videoReducer(initialState, action);

        // assert
        expect(newState).toEqual({current: {}, queued: []});
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {current: {}, queued: []};

        const video = {
            items: [{id: 'XXXXX'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', video};

        // act
        const newState = videoReducer(initialState, action);

        // assert
        expect(newState).toEqual({current: {}, queued: []});
    });
});