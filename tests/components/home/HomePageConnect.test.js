import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    connectOptions
} from '../../../src/components/home/HomePage';
import initialState from '../../../src/reducers/initialState';
import * as videoActions from '../../../src/actions/videoActions';

describe('Home Page Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            mostRecentUpload: state.mostRecentUpload,
            isLoading: state.ajaxCallsInProgress.home > 0
        };

        // act
        const mappedProps = mapStateToProps(state);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should mapDispatchToProps', () => {
        // arrange
        const dispatch = () => {};
        const expectedProps = {
            actions: bindActionCreators(videoActions, dispatch)
        };

        // act
        const mappedProps = mapDispatchToProps(dispatch);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when not loading and prev.mostRecentUpload != next.mostRecentUpload', () => {
        // arrange
        const prev = {
            mostRecentUpload: {}
        };
        const next = {
            isLoading: false,
            mostRecentUpload: {id: '0'}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areStatePropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const prev = {
            mostRecentUpload: {}
        };
        const next = {
            isLoading: true,
            mostRecentUpload: {}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
    
    it('Should correctly check areStatePropsEqual in connectOptions: return true when mostRecentUpload already retrieved', () => {
        // arrange
        const mostRecentUpload = {id: '0'};
        const prev = {
            mostRecentUpload: mostRecentUpload
        };
        const next = {
            isLoading: false,
            mostRecentUpload: mostRecentUpload
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});