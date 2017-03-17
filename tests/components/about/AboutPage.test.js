import React, {PropTypes} from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import {AboutPage} from '../../../src/components/about/AboutPage';

describe('About Page', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            channel: {
                snippet: {
                    thumbnails: {
                        medium: {
                            url: 'test.url'
                    }},
                    description: 'Dummy description.\nThis is a test.'
        }}};
    });

    it('Should create profile image', () => {
        // act
        const component = mount(<AboutPage {...props}/>);
        const image = component.find('img');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('id')).toEqual('profile-pic');
        expect(image.prop('src')).toEqual('test.url');
        expect(image.prop('alt')).toEqual('Profile Picture');
    });

    it('Should create page heading', () => {
        // act
        const component = mount(<AboutPage {...props}/>);
        const title = component.find('h3').text();

        // assert
        expect(title).toEqual('About My Channel');
    });

    it('Should create channel description', () => {
        // act
        const component = mount(<AboutPage {...props}/>);
        const description = component.find('p');
        const descriptionParts = description.find('span');

        // assert
        expect(descriptionParts.length).toEqual(2);
        expect(descriptionParts.at(0).text()).toEqual('Dummy description.');
        expect(descriptionParts.at(1).text()).toEqual('This is a test.');
    });
});