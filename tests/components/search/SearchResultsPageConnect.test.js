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
import * as videoActions from '../../../src/actions/videoActions';
import clearStore from '../../../src/actions/clearAction';

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
            videoList: state.video.queued,
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
        const combinedActions = Object.assign({}, videoActions, channelActions);
        const expectedProps = {
            actions: bindActionCreators(combinedActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };

        // act
        const mappedProps = mapDispatchToProps(dispatch);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return true when '
        + 'isLoading and pageTokens, results, videoList, and query haven\'t changed', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const results = [{id: '11'}, {id: '22'}];
        const videoList = [{id: '1'}, {id: '2'}];
        const query = 'test';

        const prev = {
            isLoading: false,
            pageToken,
            results,
            videoList,
            query
        };
        const next = {
            isLoading: true,
            pageToken,
            results,
            videoList,
            query
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const results = [{id: '11'}, {id: '22'}];
        const videoList = [{id: '1'}, {id: '2'}];
        const query = 'test';

        const prev = {
            isLoading: true,
            pageToken,
            results,
            videoList,
            query
        };
        const next = {
            isLoading: false,
            pageToken,
            results,
            videoList,
            query
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when pageTokens are different', () => {
        // arrange
        const pageToken1 = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const pageToken2 = {prevPageToken: 'XXXXX', nextPageToken: 'YYYYY'};
        const results = [{id: '11'}, {id: '22'}];
        const videoList = [{id: '1'}, {id: '2'}];
        const query = 'test';

        const prev = {
            isLoading: true,
            pageToken: pageToken1,
            results,
            videoList,
            query
        };
        const next = {
            isLoading: true,
            pageToken: pageToken2,
            results,
            videoList,
            query
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when results are different', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const results1 = [{id: '11'}, {id: '22'}];
        const results2 = [{id: '33'}, {id: '44'}];
        const videoList = [{id: '1'}, {id: '2'}];
        const query = 'test';

        const prev = {
            isLoading: true,
            pageToken,
            results: results1,
            videoList,
            query
        };
        const next = {
            isLoading: true,
            pageToken,
            results: results2,
            videoList,
            query
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when videoLists are different', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const results = [{id: '11'}, {id: '22'}];
        const videoList1 = [{id: '1'}, {id: '2'}];
        const videoList2= [{id: '3'}, {id: '4'}];
        const query = 'test';

        const prev = {
            isLoading: true,
            pageToken,
            results,
            videoList: videoList1,
            query
        };
        const next = {
            isLoading: true,
            pageToken,
            results,
            videoList: videoList2,
            query
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });

    it('Should correctly check areStatePropsEqual in connectOptions: return false when queries are different', () => {
        // arrange
        const pageToken = {prevPageToken: '', nextPageToken: 'XXXXX'};
        const results = [{id: '11'}, {id: '22'}];
        const videoList = [{id: '1'}, {id: '2'}];
        const query1 = 'test';
        const query2 = 'TEST';

        const prev = {
            isLoading: true,
            pageToken,
            results,
            videoList,
            query: query1
        };
        const next = {
            isLoading: true,
            pageToken,
            results,
            videoList,
            query: query2
        };

        // act
        const result = connectOptions.areStatePropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
});