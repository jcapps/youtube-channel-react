import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    connectOptions
} from '../../../src/components/search/SearchResultsPage';
import initialState from '../../../src/reducers/initialState';
import * as channelActions from '../../../src/actions/channelActions';

describe('Search Results Page Connect', () => {
    let ownProps;
    let state;
    let mockGetPlaylist;
    let mockGetPlaylistInfo;

    beforeEach(() => {
        // arrange
        ownProps = {
            match: { params: { q: 'TEST'} }
        };

        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            pageToken: state.searchPageToken,
            query: ownProps.match.params.q,
            results: state.searchResults,
            resultsCount: state.searchInfo.totalResults,
            isLoading: state.ajaxCallsInProgress.searchResults > 0
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
            actions: bindActionCreators(channelActions, dispatch)
        };

        // act
        const mappedProps = mapDispatchToProps(dispatch);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when finished loading and received new pageToken', () => {
        // arrange
        const prev = {
            pageToken: {prevPageToken: '', nextPageToken: ''}
        };
        const next = {
            isLoading: false,
            pageToken: {prevPageToken: '', nextPageToken: 'XXXXX'}
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areStatePropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const prev = {
            pageToken: {prevPageToken: '', nextPageToken: ''}
        };
        const next = {
            isLoading: true,
            pageToken: {prevPageToken: '', nextPageToken: 'XXXXX'}
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
            pageToken: pageToken
        };
        const next = {
            isLoading: true,
            pageToken: pageToken
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});