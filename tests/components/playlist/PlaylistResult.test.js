import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import {MemoryRouter as Router} from 'react-router';
import {Link} from 'react-router-dom';
import PlaylistResult from '../../../src/components/playlist/PlaylistResult';

describe('Playlist Result', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            playlist: {
                id: 'ID',
                kind: 'youtube#playlist',
                snippet: {
                    title: 'Playlist Title',
                    description: 'Playlist Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
        }}}}};
    });

    it('Should create a Link as a result in AllPlaylistsPage', () => {
        // act
        const component = mount(<Router><PlaylistResult {...props}/></Router>);
        const link = component.find(Link);

        // assert
        expect(link.length).toEqual(1);
        expect(link.prop('to')).toEqual('/playlist/ID');
    });

    it('Should create a Link as a result in SearchResultsPage', () => {
        // arrange
        props.playlist.id = {playlistId: 'ID'};
        props.playlist.kind = 'youtube#searchResult';

        // act
        const component = mount(<Router><PlaylistResult {...props}/></Router>);
        const link = component.find(Link);

        // assert
        expect(link.length).toEqual(1);
        expect(link.prop('to')).toEqual('/playlist/ID');
    });

    it('Should create an image thumbnail', () => {
        // act
        const component = mount(<Router><PlaylistResult {...props}/></Router>);
        const image = component.find('img');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('height')).toEqual('90');
        expect(image.prop('width')).toEqual('160');
        expect(image.prop('src')).toEqual('test.url');
        expect(image.prop('title')).toEqual('Playlist Title');
        expect(image.prop('alt')).toEqual('Playlist Title');
    });

    it('Should create a title for the result', () => {
        // act
        const component = mount(<Router><PlaylistResult {...props}/></Router>);
        const title = component.find('h3').text();

        // assert
        expect(title).toEqual('Playlist Title');
    });

    it('Should create a description for the result', () => {
        // act
        const component = mount(<Router><PlaylistResult {...props}/></Router>);
        const description = component.find('p').text();

        // assert
        expect(description).toEqual('Playlist Description');
    });
});