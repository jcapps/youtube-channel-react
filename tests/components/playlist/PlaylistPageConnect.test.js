import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import sinon from 'sinon';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../src/components/playlist/PlaylistPage';
import initialState from '../../../src/reducers/initialState';
import * as playlistActions from '../../../src/actions/playlistActions';

describe('Playlist Page Connect', () => {
    let ownProps;
    let state;
    let mockGetPlaylist;
    let mockGetPlaylistInfo;

    beforeEach(() => {
        // arrange
        ownProps = {
            match: { params: { id: 'TEST'} }
        };

        state = initialState;

        mockGetPlaylist = sinon.stub(playlistActions, 'getPlaylist');
        mockGetPlaylist.resolves();

        mockGetPlaylistInfo = sinon.stub(playlistActions, 'getPlaylistInfo');
        mockGetPlaylistInfo.resolves();
    });

    afterEach(() => {
        mockGetPlaylist.restore();
        mockGetPlaylistInfo.restore();
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            playlist: state.playlist,
            playlistInfo: state.playlistInfo,
            playlistId: ownProps.match.params.id,
            videoPageToken: state.videoPageToken,
            videoInPlaylist: state.playlistIndex,
            isLoading: state.ajaxCallsInProgress.playlist > 0
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
            actions: bindActionCreators(playlistActions, dispatch)
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
            playlistInfo: {id: ownProps.match.params.id},
            playlistId: ownProps.match.params.id,
            videoPageToken: state.videoPageToken,
            videoInPlaylist: state.playlistIndex,
            isLoading: state.ajaxCallsInProgress.playlist > 0
        };
        const actionProps = {
            actions: bindActionCreators(playlistActions, dispatch)
        };
        const props = {};

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should mergeProps as well as getPlaylist, getPlaylistInfo, and set isLoading to "true" when playlistId != playlistInfo.id', () => {
        // arrange
        const dispatch = () => {};

        const stateProps = {
            playlist: state.playlist,
            playlistInfo: state.playlistInfo,
            playlistId: ownProps.match.params.id,
            videoPageToken: state.videoPageToken,
            videoInPlaylist: state.playlistIndex,
            isLoading: state.ajaxCallsInProgress.playlist > 0
        };
        const actionProps = {
            actions: bindActionCreators(playlistActions, dispatch)
        };
        const props = {};

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        stateProps.isLoading = true;
        const expectedProps = Object.assign({}, stateProps, actionProps, props);

        // assert
        expect(mergedProps).toEqual(expectedProps);
        expect(mockGetPlaylist.calledOnce).toEqual(true);
        expect(mockGetPlaylistInfo.calledOnce).toEqual(true);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const prev = {};
        const next = {
            isLoading: false,
            playlistId: '',
            playlistInfo: {id: ''}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return false when isLoading, but playlistId != playlistInfo.id', () => {
        // arrange
        const prev = {};
        const next = {
            isLoading: true,
            playlistId: 'TEST',
            playlistInfo: {id: ''}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when isLoading and playlistId == playlistInfo.id', () => {
        // arrange
        const prev = {};
        const next = {
            isLoading: true,
            playlistId: 'TEST',
            playlistInfo: {id: 'TEST'}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});