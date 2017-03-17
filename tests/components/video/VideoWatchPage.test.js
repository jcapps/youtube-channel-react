import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {VideoWatchPage} from '../../../src/components/video/VideoWatchPage';
import VideoPlayer from '../../../src/components/common/VideoPlayer';
import * as videoActions from '../../../src/actions/videoActions';

describe('Video Watch Page', () => {
    let props;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
            video: {
                snippet: {
                    title: 'Video Title',
                    description: 'Video Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
                }}}},
            videoId: '0',
            isLoading: false,
            actions: videoActions
        };
        mockGetVideo = sinon.stub(props.actions, 'getVideo');
        mockGetVideo.returns(new Promise((resolve, reject) => {
            resolve();
        }));
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should get video on mount', () => {
        // act
        const component = shallow(<VideoWatchPage {...props}/>);
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
    });

    it('Should create a VideoPlayer', () => {
        // act
        const component = shallow(<VideoWatchPage {...props}/>);
        const player = component.find(VideoPlayer);
        
        // assert
        expect(player.length).toEqual(1);
    });

    it('Should create an empty div if still loading', () => {
        // arrange
        props.isLoading = true;

        // act
        const component = shallow(<VideoWatchPage {...props}/>);
        
        // assert
        expect(component.text()).toEqual('');
    });
});