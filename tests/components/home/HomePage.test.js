import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {HomePage} from '../../../src/components/home/HomePage';
import VideoPlayer from '../../../src/components/common/player/VideoPlayer';
import * as videoActions from '../../../src/actions/videoActions';

describe('Home Page', () => {
    let props;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
            mostRecentUpload: {id: '0'},
            actions: videoActions
        };
        mockGetVideo = sinon.stub(props.actions, 'getMostRecentUpload');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should create an empty div if still loading', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        
        // assert
        expect(component.html()).toEqual('<div></div>');
    });

    it('Should get mostRecentUpload on mount', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        component.setState({ isLoading: false });
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Most Recent Upload');
    });

    it('Should create a VideoPlayer', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        component.setState({ isLoading: false });
        const player = component.find(VideoPlayer);

        // assert
        expect(player.length).toEqual(1);
    });
});