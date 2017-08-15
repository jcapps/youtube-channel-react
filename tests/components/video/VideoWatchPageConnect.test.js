import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    connectOptions
} from '../../../src/components/video/VideoWatchPage';
import initialState from '../../../src/reducers/initialState';
import * as videoActions from '../../../src/actions/videoActions';

describe('Video Watch Page Connect', () => {
    let ownProps;
    let state;

    beforeEach(() => {
        // arrange
        ownProps = {
            match: { params: { id: 'TEST'} }
        };

        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            video: state.video.current,
            videoId: ownProps.match.params.id,
            isLoading: state.ajaxCallsInProgress.watch > 0
        };

        // act
        const mappedProps = mapStateToProps(state, ownProps);

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

    it('Should correctly check areStatePropsEqual in connectOptions: return false when not loading and videos are different', () => {
        // arrange
        const prev = {
            video: {}
        };
        const next = {
            isLoading: false,
            video: {id: '0'}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areStatePropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const prev = {
            video: {}
        };
        const next = {
            isLoading: true,
            video: {id: '0'}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
    
    it('Should correctly check areStatePropsEqual in connectOptions: return true when videos are the same', () => {
        // arrange
        const video = {id: '0'};
        const prev = {
            video: video
        };
        const next = {
            isLoading: false,
            video: video
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});