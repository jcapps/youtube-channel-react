import expect from 'expect';
import repliesReducer from '../../src/reducers/repliesReducer';
import * as commentActions from '../../src/actions/commentActions';

describe('Replies Reducer', () => {
    it('Should set replies when passed GET_REPLIES_SUCCESS', () => {
        // arrange
        const initialState = {};

        const replies = {
            items: [{id: 'XXXXX'}]
        };
        const action = commentActions.getRepliesSuccess(replies);

        // act
        const newState = repliesReducer(initialState, action);

        // assert
        expect(newState).toEqual({items: [{id: 'XXXXX'}]});    
    });

    it('Should set replies when passed GET_NEXT_REPLIES_SUCCESS', () => {
        // arrange
        const initialState = {};

        const replies = {
            items: [{id: 'XXXXX'}]
        };
        const action = commentActions.getNextRepliesSuccess(replies);

        // act
        const newState = repliesReducer(initialState, action);

        // assert
        expect(newState).toEqual({items: [{id: 'XXXXX'}]});    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {};

        const replies = {
            items: [{id: 'XXXXX'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', replies};

        // act
        const newState = repliesReducer(initialState, action);

        // assert
        expect(newState).toEqual({});    
    });
});