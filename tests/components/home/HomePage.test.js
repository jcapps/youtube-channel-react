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
            isLoading: false,
            mostRecentUpload: {id: '0'},
            actions: videoActions
        };
        mockGetVideo = sinon.stub(props.actions, 'getMostRecentUpload');
        mockGetVideo.resolves();
    });

    afterEach(() => {
        mockGetVideo.restore();
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.mostRecentUpload = {};

        // act
        const component = shallow(<HomePage {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
    });

    it('Should get mostRecentUpload on mount if not already retrieved', () => {
        // arrange
        props.mostRecentUpload = {};

        // act
        const component = shallow(<HomePage {...props}/>);
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
    });

    it('Should NOT get mostRecentUpload on mount if already retrieved', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        
        // assert
        expect(mockGetVideo.calledOnce).toEqual(false);
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Most Recent Upload');
    });

    it('Should create a VideoPlayer', () => {
        // act
        const component = shallow(<HomePage {...props}/>);
        const player = component.find(VideoPlayer);

        // assert
        expect(player.length).toEqual(1);
    });
});