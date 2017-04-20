import React, {PropTypes} from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {Link} from 'react-router';
import {AllVideosPage} from '../../../src/components/video/AllVideosPage';
import VideoResult from '../../../src/components/video/VideoResult';
import * as playlistActions from '../../../src/actions/playlistActions';

describe('All Videos Page', () => {
    let props;
    let mockGetRecentUploadsPlaylist;
    let mockGetNextVideos;
    beforeEach(() => {
        // arrange
        props = {
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
        mockGetRecentUploadsPlaylist.returns(new Promise((resolve, reject) => {
            resolve();
        }));

        mockGetNextVideos = sinon.stub(props.actions, 'getNextVideos');
        mockGetNextVideos.returns(new Promise((resolve, reject) => {
            resolve();
        }));
    });
    afterEach(() => {
        mockGetRecentUploadsPlaylist.restore();
        mockGetNextVideos.restore();
    });

    it('Should load videos on mount', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);

        // assert
        expect(mockGetRecentUploadsPlaylist.calledOnce).toEqual(true);
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Videos');
    });

    it('Should create list of videos', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        const list = component.find('#video-list');
        const links = list.find(Link);

        // assert
        expect(list.length).toEqual(1);
        expect(links.length).toEqual(3);
        expect(links.at(0).prop('to')).toEqual('/watch/1');
        expect(links.at(1).prop('to')).toEqual('/watch/2');
        expect(links.at(2).prop('to')).toEqual('/watch/3');
        expect(links.at(0).find(VideoResult).length).toEqual(1);
        expect(links.at(1).find(VideoResult).length).toEqual(1);
        expect(links.at(2).find(VideoResult).length).toEqual(1);
        expect(links.at(0).find(VideoResult).props().videoId).toEqual('1');
        expect(links.at(1).find(VideoResult).props().videoId).toEqual('2');
        expect(links.at(2).find(VideoResult).props().videoId).toEqual('3');
    });

    it('Should create "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        const list = component.find('#video-list');
        const link = list.find('a');

        // assert
        expect(link.length).toEqual(1);
        expect(link.find('div').text()).toEqual('View More');
    });

    it('Should load more results when "View More" is clicked', () => {
        // act
        const component = shallow(<AllVideosPage {...props}/>);
        const list = component.find('#video-list');
        const link = list.find('a');

        link.simulate('click');

        // assert
        expect(mockGetNextVideos.calledOnce).toEqual(true);
    });
});