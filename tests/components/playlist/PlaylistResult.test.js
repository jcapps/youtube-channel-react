import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import PlaylistResult from '../../../src/components/playlist/PlaylistResult';

describe('Playlist Result', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            playlist: {
                snippet: {
                    title: 'Playlist Title',
                    description: 'Playlist Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
        }}}}};
    });

    it('Should create an image thumbnail', () => {
        // act
        const component = mount(<PlaylistResult {...props}/>);
        const image = component.find('img');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('height')).toEqual('90');
        expect(image.prop('width')).toEqual('160');
        expect(image.prop('src')).toEqual('test.url');
        expect(image.prop('alt')).toEqual('Playlist Title');
    });

    it('Should create a title for the result', () => {
        // act
        const component = mount(<PlaylistResult {...props}/>);
        const title = component.find('h3').text();

        // assert
        expect(title).toEqual('Playlist Title');
    });

    it('Should create a description for the result', () => {
        // act
        const component = mount(<PlaylistResult {...props}/>);
        const description = component.find('p').text();

        // assert
        expect(description).toEqual('Playlist Description');
    });
});