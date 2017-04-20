import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import VideoPlayer from '../../../src/components/common/VideoPlayer';
import VideoPlayerDescription from '../../../src/components/common/VideoPlayerDescription';
import VideoPlayerStats from '../../../src/components/common/VideoPlayerStats';

describe('VideoPlayer', () => {
    let props;
    let mockAction;
    beforeEach(() => {
        // arrange
        props = {video: {}};
        mockAction = sinon.stub(VideoPlayer.prototype, 'initializePlayer');
    });
    afterEach(() => {
        mockAction.restore();
    });

    it('Should create a "player-iframe" div', () => {
        // act
        const component = shallow(<VideoPlayer {...props}/>);
        const iframeDiv = component.find('#player-iframe');

        // assert
        expect(iframeDiv.length).toEqual(1);
    });

    it('Should create a VideoPlayerDescription element', () => {
        // act
        const component = shallow(<VideoPlayer {...props}/>);
        const description = component.find(VideoPlayerDescription);

        // assert
        expect(description.length).toEqual(1);
        expect(description.props().video).toEqual(props.video);
    });

     it('Should create a VideoPlayerStats element', () => {
        // act
        const component = shallow(<VideoPlayer {...props}/>);
        const stats = component.find(VideoPlayerStats);

        // assert
        expect(stats.length).toEqual(1);
        expect(stats.props().video).toEqual(props.video);
    });
});