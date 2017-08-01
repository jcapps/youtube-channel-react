import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {Link} from 'react-router-dom';
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
                {id: {videoId: '0'}},
                {id: {playlistId: '1'}}
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
        const list = component.find('.search-list');
        const links = list.find(Link);

        // assert
        expect(list.length).toEqual(1);
        expect(links.length).toEqual(2);
        expect(links.at(0).prop('to')).toEqual('/watch/0');
        expect(links.at(1).prop('to')).toEqual('/playlist/1');
        expect(links.at(0).find(VideoResult).length).toEqual(1);
        expect(links.at(1).find(PlaylistResult).length).toEqual(1);
        expect(links.at(0).find(VideoResult).props().videoId).toEqual('0');
        expect(links.at(1).find(PlaylistResult).props().playlist).toEqual(props.results[1]);
    });

    it('Should create "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        const list = component.find('.search-list');
        const link = list.find('a');

        // assert
        expect(link.length).toEqual(1);
        expect(link.find('div').text()).toEqual('View More');
    });

    it('Should load more results when "View More" is clicked', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        const list = component.find('.search-list');
        const link = list.find('a');

        link.simulate('click');

        // assert
        expect(mockGetNextResults.calledOnce).toEqual(true);
    });
});