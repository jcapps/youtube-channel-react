import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {SearchResultsPage} from '../../../src/components/search/SearchResultsPage';
import PlaylistResult from '../../../src/components/playlist/PlaylistResult';
import VideoResult from '../../../src/components/video/VideoResult';
import * as channelActions from '../../../src/actions/channelActions';
import * as videoActions from '../../../src/actions/videoActions';
import * as videoTypes from '../../../src/reducers/videoTypes';

describe('Search Results Page', () => {
    let props;
    let mockGetSearchResults;
    let mockGetNextResults;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            query: 'QUERY',
            results: [
                {id: {kind: 'youtube#video', videoId: '0'}},
                {id: {kind: 'youtube#playlist', playlistId: '1'}}
            ],
            resultsCount: 10,
            pageToken: {nextPageToken: 'TOKEN'},
            actions: Object.assign({}, videoActions, channelActions)
        };

        mockGetSearchResults = sinon.stub(props.actions, 'getSearchResults');
        mockGetSearchResults.resolves();

        mockGetNextResults = sinon.stub(props.actions, 'getNextResults');
        mockGetNextResults.resolves();

        mockGetVideo = sinon.stub(props.actions, 'getVideo');
        mockGetVideo.resolves();
    });
    afterEach(() => {
        mockGetSearchResults.restore();
        mockGetNextResults.restore();
        mockGetVideo.restore();
    });

    it('Should load results on mount', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);

        // assert
        expect(mockGetSearchResults.calledOnce).toEqual(true);
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.isLoading = true;

        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
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

    it('Should getVideos when receives new results containing videos', () => {
        // arrange
        props.results = [];

        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({
            isLoading: false,
            rawResults: props.results
        });
        component.setProps({
            results: [
                {id: {kind: 'youtube#video', videoId: '0'}},
                {id: {kind: 'youtube#playlist', playlistId: '1'}}
            ]
        });
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
        expect(mockGetVideo.getCalls()[0].args)
            .toEqual(['0', videoTypes.QUEUED]);
    });

    it('Should create list of results', () => {
        // act
        const component = shallow(<SearchResultsPage {...props}/>);
        component.setState({
            isLoading: false,
            results: [
                {id: '0', kind: 'youtube#video'},
                {id: {kind: 'youtube#playlist', playlistId: '1'}}
            ]
        });
        const list = component.find('.search-list');
        const videoResult = list.find(VideoResult);
        const playlistResult = list.find(PlaylistResult);

        // assert
        expect(list.length).toEqual(1);
        expect(videoResult.length).toEqual(1);
        expect(playlistResult.length).toEqual(1);
        expect(videoResult.props().video).toEqual({id: '0', kind: 'youtube#video'});
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