import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../src/components/playlist/VideoQueue';
import initialState from '../../../src/reducers/initialState';
import * as videoActions from '../../../src/actions/videoActions';

describe('Video Queue Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            videoList: state.video.queued,
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
            videoList: state.video.queued,
            isLoading: state.ajaxCallsInProgress.watch > 0
        };
        const actionProps = {
            actions: bindActionCreators(videoActions, dispatch)
        };
        const props = {};

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when '
        + 'isLoading and playlist hasn\'t changed', () => {
        // arrange
        const videoList = [];
        const playlist = [{id: '1'}, {id: '2'}];
        const playlistId = '00';

        const prev = {
            isLoading: false,
            videoList,
            playlist,
            playlistId
        };
        const next = {
            isLoading: true,
            videoList,
            playlist,
            playlistId
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const videoList = [{id: '1'}, {id: '2'}];
        const playlist = [{id: '1'}, {id: '2'}];
        const playlistId = '00';

        const prev = {
            isLoading: true,
            videoList: [],
            playlist,
            playlistId
        };
        const next = {
            isLoading: false,
            videoList,
            playlist,
            playlistId
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when playlist is updated', () => {
        // arrange
        const videoList = [{id: '1'}, {id: '2'}];
        const playlist1 = [{id: '1'}, {id: '2'}];
        const playlist2 = [{id: '1'}, {id: '2'}, {id: '3'}];
        const playlistId = '00';

        const prev = {
            isLoading: false,
            videoList,
            playlist: playlist1,
            playlistId
        };
        const next = {
            isLoading: false,
            videoList,
            playlist: playlist2,
            playlistId
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when playlist is changed', () => {
        // arrange
        const videoList = [{id: '1'}, {id: '2'}];
        const playlist = [{id: '1'}, {id: '2'}];
        const playlistId1 = '00';
        const playlistId2 = '11';

        const prev = {
            isLoading: false,
            videoList,
            playlist,
            playlistId: playlistId1
        };
        const next = {
            isLoading: false,
            videoList,
            playlist,
            playlistId: playlistId2
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
});