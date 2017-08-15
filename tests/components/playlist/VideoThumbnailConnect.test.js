import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../src/components/playlist/VideoThumbnail';
import initialState from '../../../src/reducers/initialState';
import * as videoActions from '../../../src/actions/videoActions';

describe('Video Thumbnail Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            video: state.video.queued,
            isLoading: !state.video.queued.snippet
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

    it('Should mergeProps', () => {
        // arrange
        const dispatch = () => {};

        const stateProps = {
            video: state.video.queued,
            isLoading: !state.video.queued.snippet
        };
        const actionProps = {
            actions: bindActionCreators(videoActions, dispatch)
        };
        const props = {
            videoId: '0',
            playlistIndex: 0
        };

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return false when videoId == video.id', () => {
        // arrange
        const prev = {};
        const next = {
            videoId: '0',
            video: {id: '0'}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when videoId != video.id', () => {
        // arrange
        const prev = {};
        const next = {
            videoId: '0',
            video: {id: '1'}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});