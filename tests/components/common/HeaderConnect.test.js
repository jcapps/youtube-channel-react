import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    connectOptions
} from '../../../src/components/common/Header';
import initialState from '../../../src/reducers/initialState';
import * as playlistActions from '../../../src/actions/playlistActions';

describe('Header Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            allPlaylists: state.playlist,
            channel: state.channelInfo,
            isLoading: state.ajaxCallsInProgress.header > 0
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
            actions: bindActionCreators(playlistActions, dispatch)
        };

        // act
        const mappedProps = mapDispatchToProps(dispatch);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const prev = { isLoading: true };
        const next = { isLoading: false };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const prev = { isLoading: true };
        const next = { isLoading: true };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});