import React, {PropTypes} from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import {HomePage} from '../../../src/components/home/HomePage';
import VideoPlayer from '../../../src/components/common/VideoPlayer';

describe('Home Page', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            mostRecentUpload: {id: '0'},
            isLoading: false
        };
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

    it('Should return empty div while page is loading', () => {
        // arrange
        props = {
            mostRecentUpload: {id: '0'},
            isLoading: true
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
            isLoading: false
        };

        // act
        const component = shallow(<HomePage {...props}/>);

        // assert
        expect(component.text()).toEqual('(Video not found.)');
    });
});