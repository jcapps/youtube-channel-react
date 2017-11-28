import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import sinon from 'sinon';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../src/components/video/AllVideosPage';
import initialState from '../../../src/reducers/initialState';
import * as playlistActions from '../../../src/actions/playlistActions';
import * as videoActions from '../../../src/actions/videoActions';
import clearStore from '../../../src/actions/clearAction';

describe('All Videos Page Connect', () => {
    let state;
    let mockGetRecentUploadsPlaylist;

    beforeEach(() => {
        // arrange
        state = initialState;

        mockGetRecentUploadsPlaylist = sinon.stub(playlistActions, 'getRecentUploadsPlaylist');
        mockGetRecentUploadsPlaylist.resolves();
    });

    afterEach(() => {
        mockGetRecentUploadsPlaylist.restore();
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            playlist: state.playlist,
            playlistId: state.recentUploadsPlaylistId,
            videoPageToken: state.videoPageToken,
            videoList: state.video.queued,
            isLoading: state.ajaxCallsInProgress.allVideos > 0
        };

        // act
        const mappedProps = mapStateToProps(state);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should mapDispatchToProps', () => {
        // arrange
        const dispatch = () => {};
        const combinedActions = Object.assign({}, videoActions, playlistActions);
        const expectedProps = {
            actions: bindActionCreators(combinedActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
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
            playlist: state.playlist,
            playlistId: state.recentUploadsPlaylistId,
            videoPageToken: state.videoPageToken,
            videoList: state.video.queued,
            isLoading: state.ajaxCallsInProgress.playlist > 0
        };
        const combinedActions = Object.assign({}, videoActions, playlistActions);
        const actionProps = {
            actions: bindActionCreators(combinedActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };
        const props = {};

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should mergeProps as well as getRecentUploadsPlaylist and set isLoading to "true" when not loading and playlist.length == 0', () => {
        // arrange
        const dispatch = () => {};

        const stateProps = {
            playlist: state.playlist,
            playlistId: state.recentUploadsPlaylistId,
            videoPageToken: state.videoPageToken,
            videoList: state.video.queued,
            isLoading: state.ajaxCallsInProgress.playlist > 0
        };
        const combinedActions = Object.assign({}, videoActions, playlistActions);
        const actionProps = {
            actions: bindActionCreators(combinedActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };
        const props = {};

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        stateProps.isLoading = true;
        const expectedProps = Object.assign({}, stateProps, actionProps, props);

        // assert
        expect(mergedProps).toEqual(expectedProps);
        expect(mockGetRecentUploadsPlaylist.calledOnce).toEqual(true);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const videoList = [{id: '1'}, {id: '2'}];
        const prev = {
            isLoading: false,
            videoPageToken: pageToken,
            videoList: videoList
        };
        const next = {
            isLoading: true,
            videoPageToken: {},
            videoList: []
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return true when both pairs of pageTokens and videoLists are the same', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const videoList = [{id: '1'}, {id: '2'}];
        const prev = {
            isLoading: true,
            videoPageToken: pageToken,
            videoList: videoList
        };
        const next = {
            isLoading: false,
            videoPageToken: pageToken,
            videoList: videoList
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return false when '
        + 'finished loading and videoPageToken has changed', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const videoList = [{id: '1'}, {id: '2'}];
        const prev = {
            isLoading: true,
            videoPageToken: {},
            videoList: videoList
        };
        const next = {
            isLoading: false,
            videoPageToken: pageToken,
            videoList: videoList
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when '
        + 'finished loading and videoPageToken has changed', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const videoList = [{id: '1'}, {id: '2'}];
        const prev = {
            isLoading: true,
            videoPageToken: pageToken,
            videoList: []
        };
        const next = {
            isLoading: false,
            videoPageToken: pageToken,
            videoList: videoList
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
});