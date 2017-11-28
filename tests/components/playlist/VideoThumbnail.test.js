import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import {VideoThumbnail} from '../../../src/components/playlist/VideoThumbnail';

describe('Video Thumbnail', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            playlistIndex: 0,
            video: {
                snippet: {
                    title: 'Video Title',
                    channelTitle: 'Channel Title',
                    description: 'Video Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
            }}}}
        };
    });

    it('Should create an image thumbnail', () => {
        // act
        const component = mount(<VideoThumbnail {...props}/>);
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
        const videoTitle = component.find('h3');
        const channelName = component.find('p');

        // assert
        expect(videoTitle.length).toEqual(1);
        expect(channelName.length).toEqual(1);
        expect(videoTitle.text()).toEqual(+props.playlistIndex + 1 + '. ' + props.video.snippet.title);
        expect(channelName.text()).toEqual(props.video.snippet.channelTitle);
    });
});