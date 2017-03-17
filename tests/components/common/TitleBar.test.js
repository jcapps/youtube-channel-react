import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import TitleBar from '../../../src/components/common/TitleBar';

describe('TitleBar', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            channel: {
                snippet: {
                    thumbnails: {
                        default: {
                            url: 'test.url'
        }}}}};
    });

    it('Should create profile img avatar', () => {
        // act
        const component = mount(<TitleBar {...props}/>);
        const image = component.find('img');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('id')).toEqual('profile-thumbnail');
        expect(image.prop('src')).toEqual('test.url');
        expect(image.prop('alt')).toEqual('Profile Thumbnail');
    });

    it('Should create website title', () => {
        // act
        const component = mount(<TitleBar {...props}/>);
        const title = component.find('h3').text();

        // assert
        expect(title).toEqual("James Capps' YouTube Channel");
    });
});