import expect from 'expect';
import { CLEAR_STORE } from '../../src/actions/actionTypes';
import clearStore from '../../src/actions/clearAction';

describe('Clear Action', () => {
    describe('clearStore', () => {
        it('Should create a CLEAR_STORE action', () => {
            // arrange
            const expectedAction = { type: CLEAR_STORE };

            // act
            const action = clearStore();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });
});