import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import sinon from 'sinon';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../src/components/playlist/PlaylistPlayer';
import initialState from '../../../src/reducers/initialState';
import * as videoActions from '../../../src/actions/videoActions';

describe('Playlist Player Connect', () => {
    let state;
    let mockGetVideo;

    beforeEach(() => {
        // arrange
        state = initialState;

        mockGetVideo = sinon.stub(videoActions, 'getVideo');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            video: state.video.current,
            isLoading: state.ajaxCallsInProgress.watch > 0
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
            video: {id: '0'},
            isLoading: state.ajaxCallsInProgress.watch > 0
        };
        const actionProps = {
            actions: bindActionCreators(videoActions, dispatch)
        };
        const props = {
            playlistId: 'TEST',
            playlistIndex: 0,
            videoId: '0',
            updatePlaylist: () => {}
        };

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should mergeProps as well as getVideo and set isLoading to "true" when videoId != video.id', () => {
        // arrange
        const dispatch = () => {};

        const stateProps = {
            video: state.video.current,
            isLoading: state.ajaxCallsInProgress.watch > 0
        };
        const actionProps = {
            actions: bindActionCreators(videoActions, dispatch)
        };
        const props = {
            playlistId: 'TEST',
            playlistIndex: 0,
            videoId: '0',
            updatePlaylist: () => {}
        };

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        stateProps.isLoading = true;
        const expectedProps = Object.assign({}, stateProps, actionProps, props);

        // assert
        expect(mergedProps).toEqual(expectedProps);
        expect(mockGetVideo.calledOnce).toEqual(true);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const prev = {};
        const next = { isLoading: false };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const prev = {};
        const next = { isLoading: true };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});