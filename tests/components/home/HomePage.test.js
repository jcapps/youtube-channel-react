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
            isLoading: false,
            actions: videoActions
        };
        mockGetVideo = sinon.stub(props.actions, 'getMostRecentUpload');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
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

    it('Should return empty div while page is loading', () => {
        // arrange
        props = {
            mostRecentUpload: {id: '0'},
            isLoading: true,
            actions: videoActions
        };

        // act
        const component = shallow(<HomePage {...props}/>);

        // assert
        expect(component.text()).toEqual('');
    });

    it('Should return "Video not found" if no ID found for mostRecentUpload', () => {
        // arrange
        props = {
            mostRecentUpload: {id: null},
            isLoading: false,
            actions: videoActions
        };

        // act
        const component = shallow(<HomePage {...props}/>);
        component.setState({ isLoading: false });

        // assert
        expect(component.text()).toEqual('(Video not found.)');
    });
});