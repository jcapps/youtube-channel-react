import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    connectOptions
} from '../../../src/components/playlist/PlaylistPage';
import initialState from '../../../src/reducers/initialState';
import * as playlistActions from '../../../src/actions/playlistActions';

describe('Playlist Page Connect', () => {
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
            playlist: state.playlist,
            playlistInfo: state.playlistInfo,
            playlistId: ownProps.match.params.id,
            videoPageToken: state.videoPageToken,
            playlistIndex: state.playlistIndex,
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

    it('Should correctly check areStatePropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const prev = {
            isLoading: true,
            playlistId: '',
            playlistInfo: {id: ''}
        };
        const next = {
            isLoading: false,
            playlistId: '',
            playlistInfo: {id: ''}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areStatePropsEqual in connectOptions: return false when isLoading, but playlist and playlistInfo have changed', () => {
        // arrange
        const prev = {
            isLoading: true,
            playlist: [],
            playlistInfo: {id: 'TEST'}
        };
        const next = {
            isLoading: true,
            playlist: [{id: '1'}],
            playlistInfo: {id: 'NEW_TEST'}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return true when isLoading and playlist hasn\'t changed', () => {
        // arrange
        const playlist = [];
        const playlistInfo = {id: 'TEST'};
        const prev = {
            isLoading: true,
            playlist,
            playlistInfo
        };
        const next = {
            isLoading: true,
            playlist,
            playlistInfo
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});