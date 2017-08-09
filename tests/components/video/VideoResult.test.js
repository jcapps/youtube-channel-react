import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {MemoryRouter as Router} from 'react-router';
import {Link} from 'react-router-dom';
import {VideoResult} from '../../../src/components/video/VideoResult';
import * as videoActions from '../../../src/actions/videoActions';

describe('Video Result', () => {
    let props;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
            video: {
                id: '0',
                snippet: {
                    title: 'Video Title',
                    description: 'Video Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
                }}}},
            videoId: '0',
            actions: videoActions
        };
        mockGetVideo = sinon.stub(props.actions, 'getVideo');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should create an empty div if still loading', () => {
        // arrange
        props.video = {};

        // act
        const component = mount(<Router><VideoResult {...props}/></Router>);
        
        // assert
        expect(component.html()).toEqual('<div></div>');
    });
    
    it('Should create a Link', () => {
        // act
        const component = mount(<Router><VideoResult {...props}/></Router>);
        const link = component.find(Link);

        // assert
        expect(link.length).toEqual(1);
        expect(link.prop('to')).toEqual('/watch/' + props.videoId);
    });

    it('Should create an image thumbnail', () => {
        // act
        const component = mount(<Router><VideoResult {...props}/></Router>);
        component.setState({
            video: props.video,
            isLoading: false
        });
        const image = component.find('img');
        
        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('height')).toEqual('90');
        expect(image.prop('width')).toEqual('160');
        expect(image.prop('src')).toEqual('test.url');
        expect(image.prop('alt')).toEqual('Video Title');
        expect(image.prop('title')).toEqual('Video Title');
    });

    it('Should create a title for the result', () => {
        // act
        const component = mount(<Router><VideoResult {...props}/></Router>);
        component.setState({
            video: props.video,
            isLoading: false
        });
        const title = component.find('h4').text();

        // assert
        expect(title).toEqual('Video Title');
    });

    it('Should create a description for the result', () => {
        // act
        const component = mount(<Router><VideoResult {...props}/></Router>);
        component.setState({
            video: props.video,
            isLoading: false
        });
        const description = component.find('p').text();

        // assert
        expect(description).toEqual('Video Description');
    });
});