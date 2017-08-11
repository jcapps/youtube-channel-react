import expect from 'expect';
import commentsReducer from '../../src/reducers/commentsReducer';
import * as commentActions from '../../src/actions/commentActions';
import clearStore from '../../src/actions/clearAction';

describe('Comments Reducer', () => {
    it('Should set comments when passed GET_COMMENTS_SUCCESS', () => {
        // arrange
        const initialState = {};

        const comments = {
            items: [{id: 'XXXXX'}]
        };
        const action = commentActions.getCommentsSuccess(comments);

        // act
        const newState = commentsReducer(initialState, action);

        // assert
        expect(newState).toEqual({items: [{id: 'XXXXX'}]});    
    });

    it('Should set comments when passed GET_NEXT_COMMENTS_SUCCESS', () => {
        // arrange
        const initialState = {};

        const comments = {
            items: [{id: 'XXXXX'}]
        };
        const action = commentActions.getNextCommentsSuccess(comments);

        // act
        const newState = commentsReducer(initialState, action);

        // assert
        expect(newState).toEqual({items: [{id: 'XXXXX'}]});    
    });

    it('Should clear comments when passed CLEAR_STORE', () => {
        // arrange
        const initialState = {items: [{id: 'XXXXX'}]};

        const action = clearStore();

        // act
        const newState = commentsReducer(initialState, action);

        // assert
        expect(newState).toEqual({});
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {};

        const comments = {
            items: [{id: 'XXXXX'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', comments};

        // act
        const newState = commentsReducer(initialState, action);

        // assert
        expect(newState).toEqual({});    
    });
});