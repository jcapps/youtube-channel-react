import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {SearchResultsPage} from '../../../src/components/search/SearchResultsPage';
import PlaylistResult from '../../../src/components/playlist/PlaylistResult';
import VideoResult from '../../../src/components/video/VideoResult';
import * as channelActions from '../../../src/actions/channelActions';

describe('Search Results Page', () => {
    let props;
    let mockGetSearchResults;
    let mockGetNextResults;
    beforeEach(() => {
        // arrange
        props = {
            query: 'QUERY',
            results: [
                {id: {kind: 'youtube#video', videoId: '0'}},
                {id: {kind: 'youtube#playlist', playlistId: '1'}}
            ],
            resultsCount: 10,
            pageToken: {nextPageToken: 'TOKEN'},
            actions: channelActions
        };

        mockGetSearchResults = sinon.stub(props.actions, 'getSearchResults');
        mockGetSearchResults.resolves();

        mockGetNextResults = sinon.stub(props.actions, 'getNextResults');
        mockGetNextResults.resolves();
    });
    afterEach(() => {
        mockGetSearchResults.restore();
        mockGetNextResults.restore();
    });

    it('Should load results on mount', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);

        // assert
        expect(mockGetSearchResults.calledOnce).toEqual(true);
    });

    it('Should create page heading if results found', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({ isLoading: false });
        const title = component.find('h3');
        const querySpan = title.children('span').at(1);
        const resultsCount = component.find('h4');

        // assert
        expect(title.text()).toEqual('Search results for: QUERY');
        expect(querySpan.hasClass('results-found')).toEqual(true);
        expect(querySpan.hasClass('no-results')).toEqual(false);
        expect(resultsCount.text()).toEqual('Results found: 10');
    });

    it('Should create page heading if no results found', () => {
        // arrange
        props.results = [];
        props.resultsCount = 0;

        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({ isLoading: false });
        const title = component.find('h3');
        const querySpan = title.children('span').at(1);
        const resultsCount = component.find('h4');

        // assert
        expect(title.text()).toEqual('Search results for: QUERY');
        expect(querySpan.hasClass('results-found')).toEqual(false);
        expect(querySpan.hasClass('no-results')).toEqual(true);
        expect(resultsCount.text()).toEqual('Results found: 0');
    });

    it('Should create list of results', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({ isLoading: false });
        const list = component.find('.search-list');
        const videoResult = list.find(VideoResult);
        const playlistResult = list.find(PlaylistResult);

        // assert
        expect(list.length).toEqual(1);
        expect(videoResult.length).toEqual(1);
        expect(playlistResult.length).toEqual(1);
        expect(videoResult.props().videoId).toEqual('0');
        expect(playlistResult.props().playlist).toEqual(props.results[1]);
    });

    it('Should create "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({ isLoading: false });
        const list = component.find('.search-list');
        const link = list.find('a');

        // assert
        expect(link.length).toEqual(1);
        expect(link.find('div').text()).toEqual('View More');
    });

    it('Should load more results when "View More" is clicked', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({ isLoading: false });
        const list = component.find('.search-list');
        const link = list.find('a');

        link.simulate('click');

        // assert
        expect(mockGetNextResults.calledOnce).toEqual(true);
    });
});