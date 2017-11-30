import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {VideoQueue} from '../../../src/components/playlist/VideoQueue';
import VideoThumbnail from '../../../src/components/playlist/VideoThumbnail';
import * as videoActions from '../../../src/actions/videoActions';
import * as videoTypes from '../../../src/reducers/videoTypes';

describe('Video Queue', () => {
    let props;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            playlist: [
                {snippet: {
                    position: 0,
                    resourceId: {videoId: '0'}
                }},
                {snippet: {
                    position: 1,
                    resourceId: {videoId: '1'}
                }}
            ],
            nowPlayingIndex: 0,
            videoList: [{id: '1'}, {id: '2'}],
            changeVideo: () => {},
            actions: videoActions
        };

        mockGetVideo = sinon.stub(props.actions, 'getVideo');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.videoList = [];

        // act
        const component = shallow(<VideoQueue {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
    });

    it('Should getVideos in queue', () => {
        // arrange
        props.videoList = [];

        // act
        const component = shallow(<VideoQueue {...props}/>);
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
        expect(mockGetVideo.getCalls()[0].args)
            .toEqual(['0,1', videoTypes.QUEUED]);
    });
    
    it('Should getVideos when receives new playlist', () => {
        // arrange
        props.videoList = [];

        // act
        const component = shallow(<VideoQueue {...props}/>);
        component.setProps({
            playlist: [
                {snippet: {
                    position: 0,
                    resourceId: {videoId: '0'}
                }},
                {snippet: {
                    position: 1,
                    resourceId: {videoId: '1'}
                }},
                {snippet: {
                    position: 2,
                    resourceId: {videoId: '2'}
                }}
            ]
        });
        
        // assert
        expect(mockGetVideo.calledTwice).toEqual(true);
    });
    
    it('Should create the video list', () => {
        // act
        const component = shallow(<VideoQueue {...props}/>);
        component.setState({isLoading: false});
        const videoDivs = component.children('div');

        const video1 = props.videoList[0];
        const video2 = props.videoList[1];

        // assert
        expect(videoDivs.length).toEqual(2);
        expect(videoDivs.at(0).hasClass('playlist-video')).toEqual(true);
        expect(videoDivs.at(1).hasClass('playlist-video')).toEqual(true);
        expect(videoDivs.at(0).hasClass('selected')).toEqual(true);
        expect(videoDivs.at(1).hasClass('selected')).toEqual(false);
        expect(videoDivs.at(0).prop('id')).toEqual(0);
        expect(videoDivs.at(1).prop('id')).toEqual(1);
        expect(videoDivs.at(0).find(VideoThumbnail).length).toEqual(1);
        expect(videoDivs.at(1).find(VideoThumbnail).length).toEqual(1);
        expect(videoDivs.at(0).find(VideoThumbnail).prop('video')).toEqual(video1);
        expect(videoDivs.at(1).find(VideoThumbnail).prop('video')).toEqual(video2);
        expect(videoDivs.at(0).find(VideoThumbnail).prop('playlistIndex')).toEqual(0);
        expect(videoDivs.at(1).find(VideoThumbnail).prop('playlistIndex')).toEqual(1);
    });
});