import expect from 'expect';
import ajaxStatusReducer from '../../src/reducers/ajaxStatusReducer';
import * as ajaxStatusActions from '../../src/actions/ajaxStatusActions';

describe('Ajax Status Reducer', () => {
    it('Should increase ajaxCallsInProgress when passed BEGIN_AJAX_CALL', () => {
        // arrange
        const initialState = 0;
        const action = ajaxStatusActions.beginAjaxCall();

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(initialState + 1); 
    });

    it('Should decrease ajaxCallsInProgress when passed AJAX_CALL_ERROR', () => {
        // arrange
        const initialState = 2;
        const action = ajaxStatusActions.ajaxCallError();

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(initialState - 1); 
    });

    it('Should decrease ajaxCallsInProgress when passed an action that ends with "_SUCCESS"', () => {
        // arrange
        const initialState = 2;
        const action = {type: '***TEST***_SUCCESS'};

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(initialState - 1); 
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = 0;
        const action = {type: 'DUMMY_ACTION_FAIL'};

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(initialState);
    });
});