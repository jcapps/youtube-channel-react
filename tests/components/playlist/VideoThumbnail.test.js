import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {VideoThumbnail} from '../../../src/components/playlist/VideoThumbnail';
import * as videoActions from '../../../src/actions/videoActions';

describe('Video Thumbnail', () => {
    let props;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            playlistIndex: 0,
            videoId: '0',
            video: {
                snippet: {
                    title: 'Video Title',
                    channelTitle: 'Channel Title',
                    description: 'Video Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
            }}}},
            actions: videoActions
        };

        mockGetVideo = sinon.stub(props.actions, 'getVideo');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should get video on mount', () => {
        // act
        const component = mount(<VideoThumbnail {...props}/>);

        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
    });

    it('Should create an empty div if still loading', () => {
        // act
        const component = mount(<VideoThumbnail {...props}/>);
        
        // assert
        expect(component.html()).toEqual('<div></div>');
    });

    it('Should create an image thumbnail', () => {
        // act
        const component = mount(<VideoThumbnail {...props}/>);
        component.setState({
            video: props.video,
            isLoading: false
        });
        const image = component.find('img');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('height')).toEqual('67.5');
        expect(image.prop('width')).toEqual('120');
        expect(image.prop('title')).toEqual(props.video.snippet.title);
        expect(image.prop('src')).toEqual(props.video.snippet.thumbnails.medium.url);
        expect(image.prop('alt')).toEqual(props.video.snippet.title);
    });

    it('Should create thumbnail info', () => {
        // act
        const component = mount(<VideoThumbnail {...props}/>);
        component.setState({
            video: props.video,
            isLoading: false
        });
        const videoTitle = component.find('h3');
        const channelName = component.find('p');

        // assert
        expect(videoTitle.length).toEqual(1);
        expect(channelName.length).toEqual(1);
        expect(videoTitle.text()).toEqual(+props.playlistIndex + 1 + '. ' + props.video.snippet.title);
        expect(channelName.text()).toEqual(props.video.snippet.channelTitle);
    });
});