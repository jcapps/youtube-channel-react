import expect from 'expect';
import mostRecentUploadReducer from '../../src/reducers/mostRecentUploadReducer';
import * as videoActions from '../../src/actions/videoActions';

describe('Most Recent Upload Reducer', () => {
    it('Should set mostRecentUpload when passed GET_MOST_RECENT_UPLOAD_SUCCESS', () => {
        // arrange
        const initialState = {};

        const video = {
            items: [{id: 'XXXXX'}]
        };
        const action = videoActions.getMostRecentUploadSuccess(video);

        // act
        const newState = mostRecentUploadReducer(initialState, action);

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
        const newState = mostRecentUploadReducer(initialState, action);

        // assert
        expect(newState).toEqual({});    
    });
});