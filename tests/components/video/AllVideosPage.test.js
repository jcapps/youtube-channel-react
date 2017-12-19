import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {AllVideosPage} from '../../../src/components/video/AllVideosPage';
import VideoResult from '../../../src/components/video/VideoResult';
import * as playlistActions from '../../../src/actions/playlistActions';
import * as videoTypes from '../../../src/reducers/videoTypes';

describe('All Videos Page', () => {
    let props;
    let mockGetRecentUploadsPlaylist;
    let mockGetNextVideos;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            playlist: [
                {snippet: {title: 'Title 1', resourceId: {videoId: '1'}}},
                {snippet: {title: 'Title 2', resourceId: {videoId: '2'}}},
                {snippet: {title: 'Title 3', resourceId: {videoId: '3'}}}
            ],
            playlistId: '0',
            videoPageToken: {
                nextPageToken: 'TOKEN'
            },
            actions: playlistActions
        };

        mockGetRecentUploadsPlaylist = sinon.stub(props.actions, 'getRecentUploadsPlaylist');
        mockGetRecentUploadsPlaylist.resolves();

        mockGetNextVideos = sinon.stub(props.actions, 'getNextVideos');
        mockGetNextVideos.resolves();
    });
    afterEach(() => {
        mockGetRecentUploadsPlaylist.restore();
        mockGetNextVideos.restore();
    });

    it('Should load recentUploadsPlaylist on mount', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);

        // assert
        expect(mockGetRecentUploadsPlaylist.calledOnce).toEqual(true);
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.isLoading = true;

        // act
        const component = shallow(<AllVideosPage {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({isLoading: false});
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Videos');
    });

    it('Should create list of videos', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({isLoading: false});
        const list = component.find('.search-list');
        const listItem = list.find(VideoResult);

        // assert
        expect(list.length).toEqual(1);
        expect(listItem.length).toEqual(3);
        expect(listItem.at(0).props().video).toEqual(props.playlist[0]);
        expect(listItem.at(1).props().video).toEqual(props.playlist[1]);
        expect(listItem.at(2).props().video).toEqual(props.playlist[2]);
        expect(listItem.at(0).props().video.id).toEqual(props.playlist[0].snippet.resourceId.videoId);
        expect(listItem.at(1).props().video.id).toEqual(props.playlist[1].snippet.resourceId.videoId);
        expect(listItem.at(2).props().video.id).toEqual(props.playlist[2].snippet.resourceId.videoId);
    });

    it('Should create "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({isLoading: false});
        const list = component.find('.search-list');
        const link = list.find('a');

        // assert
        expect(link.length).toEqual(1);
        expect(link.find('div').text()).toEqual('View More');
    });

    it('Should load more results when "View More" is clicked', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({isLoading: false});
        const list = component.find('.search-list');
        const link = list.find('a');

        link.simulate('click');

        // assert
        expect(mockGetNextVideos.calledOnce).toEqual(true);
    });
});