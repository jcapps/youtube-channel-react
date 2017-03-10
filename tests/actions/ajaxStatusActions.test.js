import expect from 'expect';
import * as types from '../../src/actions/actionTypes';
import * as ajaxStatusActions from '../../src/actions/ajaxStatusActions';

describe('Ajax Status Actions', () => {
    describe('beginAjaxCall', () => {
        it('Should create a BEGIN_AJAX_CALL action', () => {
            // arrange
            const expectedAction = {type: types.BEGIN_AJAX_CALL};

            // act
            const action = ajaxStatusActions.beginAjaxCall();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('ajaxCallError', () => {
        it('Should create a AJAX_CALL_ERROR action', () => {
            // arrange
            const expectedAction = {type: types.AJAX_CALL_ERROR};

            // act
            const action = ajaxStatusActions.ajaxCallError();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });
});