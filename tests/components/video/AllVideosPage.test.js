import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {AllVideosPage} from '../../../src/components/video/AllVideosPage';
import VideoResult from '../../../src/components/video/VideoResult';
import * as playlistActions from '../../../src/actions/playlistActions';
import * as videoActions from '../../../src/actions/videoActions';
import * as videoTypes from '../../../src/reducers/videoTypes';

describe('All Videos Page', () => {
    let props;
    let mockGetRecentUploadsPlaylist;
    let mockGetNextVideos;
    let mockGetVideo;
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
            videoList: [
                {id: '1'},
                {id: '2'},
                {id: '3'}
            ],
            actions: Object.assign({}, videoActions, playlistActions)
        };

        mockGetRecentUploadsPlaylist = sinon.stub(props.actions, 'getRecentUploadsPlaylist');
        mockGetRecentUploadsPlaylist.resolves();

        mockGetNextVideos = sinon.stub(props.actions, 'getNextVideos');
        mockGetNextVideos.resolves();

        mockGetVideo = sinon.stub(props.actions, 'getVideo');
        mockGetVideo.resolves();
    });
    afterEach(() => {
        mockGetRecentUploadsPlaylist.restore();
        mockGetNextVideos.restore();
        mockGetVideo.restore();
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({
            isLoading: false,
            videoList: props.videoList
        });
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Videos');
    });

    it('Should getVideos when receives new playlist', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({
            isLoading: false,
            videoList: props.videoList
        });

        mockGetVideo.reset();
        component.setProps({
            playlist: [
                {snippet: {title: 'Title 1', resourceId: {videoId: '1'}}},
                {snippet: {title: 'Title 2', resourceId: {videoId: '2'}}},
                {snippet: {title: 'Title 3', resourceId: {videoId: '3'}}},
                {snippet: {title: 'Title 4', resourceId: {videoId: '4'}}},
                {snippet: {title: 'Title 5', resourceId: {videoId: '5'}}},
                {snippet: {title: 'Title 6', resourceId: {videoId: '6'}}}
            ]
        });
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
        expect(mockGetVideo.getCalls()[0].args)
            .toEqual(['4,5,6', videoTypes.QUEUED]);
    });

    it('Should create list of videos', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({
            isLoading: false,
            videoList: props.videoList
        });
        const list = component.find('.search-list');
        const listItem = list.find(VideoResult);

        // assert
        expect(list.length).toEqual(1);
        expect(listItem.length).toEqual(3);
        expect(listItem.at(0).props().video).toEqual(props.videoList[0]);
        expect(listItem.at(1).props().video).toEqual(props.videoList[1]);
        expect(listItem.at(2).props().video).toEqual(props.videoList[2]);
    });

    it('Should create "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({
            isLoading: false,
            videoList: props.videoList
        });
        const list = component.find('.search-list');
        const link = list.find('a');

        // assert
        expect(link.length).toEqual(1);
        expect(link.find('div').text()).toEqual('View More');
    });

    it('Should load more results when "View More" is clicked', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        component.setState({
            isLoading: false,
            videoList: props.videoList
        });
        const list = component.find('.search-list');
        const link = list.find('a');

        link.simulate('click');

        // assert
        expect(mockGetNextVideos.calledOnce).toEqual(true);
    });
});