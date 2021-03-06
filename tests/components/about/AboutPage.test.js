import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import {AboutPage} from '../../../src/components/about/AboutPage';

describe('About Page', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            channel: {
                snippet: {
                    thumbnails: {
                        medium: {
                            url: 'test.url'
                    }},
                    description: 'Dummy description.\nThis is a test.'
        }}};
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.isLoading = true;

        // act
        const component = shallow(<AboutPage {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
    });

    it('Should create profile image', () => {
        // act
        const component = shallow(<AboutPage {...props}/>);
        const image = component.find('img');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('id')).toEqual('profile-pic');
        expect(image.prop('src')).toEqual('test.url');
        expect(image.prop('alt')).toEqual('Profile Picture');
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<AboutPage {...props}/>);
        const title = component.find('h3').text();

        // assert
        expect(title).toEqual('About My Channel');
    });

    it('Should create channel description', () => {
        // act
        const component = shallow(<AboutPage {...props}/>);
        const description = component.find('p');
        const descriptionParts = description.find('span');

        // assert
        expect(descriptionParts.length).toEqual(2);
        expect(descriptionParts.at(0).text()).toEqual('Dummy description.');
        expect(descriptionParts.at(1).text()).toEqual('This is a test.');
    });

    it('Should display "Unable to load About page" if no channelInfo', () => {
        props.channel = {};
        // act
        const component = shallow(<AboutPage {...props}/>);

        // assert
        expect(component.text()).toEqual('(Unable to load About page)');
    });
});