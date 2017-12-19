import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import sinon from 'sinon';
import {
    mapStateToProps,
    mapDispatchToProps,
    connectOptions
} from '../../../src/components/video/AllVideosPage';
import initialState from '../../../src/reducers/initialState';
import * as playlistActions from '../../../src/actions/playlistActions';
import clearStore from '../../../src/actions/clearAction';

describe('All Videos Page Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            playlist: state.playlist,
            playlistId: state.recentUploadsPlaylistId,
            videoPageToken: state.videoPageToken,
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
        const expectedProps = {
            actions: bindActionCreators(playlistActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };

        // act
        const mappedProps = mapDispatchToProps(dispatch);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const prev = {
            isLoading: false,
            videoPageToken: {}
        };
        const next = {
            isLoading: true,
            videoPageToken: pageToken
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return true when pageTokens are the same', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const prev = {
            isLoading: false,
            videoPageToken: pageToken
        };
        const next = {
            isLoading: false,
            videoPageToken: pageToken
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when '
        + 'finished loading and pageToken has changed', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const prev = {
            isLoading: true,
            videoPageToken: {}
        };
        const next = {
            isLoading: false,
            videoPageToken: pageToken
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
});