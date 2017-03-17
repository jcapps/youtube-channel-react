import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import VideoPlayer from '../../../src/components/common/VideoPlayer';

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
});