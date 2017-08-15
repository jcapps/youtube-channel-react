import React from 'react';
import expect from 'expect';
import {mapStateToProps} from '../../../src/components/about/AboutPage';
import initialState from '../../../src/reducers/initialState';

describe('About Page Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            channel: state.channelInfo,
            isLoading: state.ajaxCallsInProgress.about > 0
        };

        // act
        const mappedProps = mapStateToProps(state);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });
});