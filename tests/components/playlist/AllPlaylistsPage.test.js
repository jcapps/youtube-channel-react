import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {AllPlaylistsPage} from '../../../src/components/playlist/AllPlaylistsPage';
import PlaylistResult from '../../../src/components/playlist/PlaylistResult';
import * as playlistActions from '../../../src/actions/playlistActions';

describe('All Playlists Page', () => {
    let props;
    let mockGetAllPlaylists;
    let mockGetNextPlaylists;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            playlists: [
                {id: '1', snippet: {title: 'Title 1'}},
                {id: '2', snippet: {title: 'Title 2'}},
                {id: '3', snippet: {title: 'Title 3'}}
            ],
            playlistPageToken: {
                nextPageToken: 'TOKEN'
            },
            actions: playlistActions
        };

        mockGetAllPlaylists = sinon.stub(props.actions, 'getAllPlaylists');
        mockGetAllPlaylists.resolves();

        mockGetNextPlaylists = sinon.stub(props.actions, 'getNextPlaylists');
        mockGetNextPlaylists.resolves();
    });
    afterEach(() => {
        mockGetAllPlaylists.restore();
        mockGetNextPlaylists.restore();
    });

    it('Should load playlists on mount', () => {
        // act
        const component = shallow(<AllPlaylistsPage {...props}/>);

        // assert
        expect(mockGetAllPlaylists.calledOnce).toEqual(true);
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.isLoading = true;

        // act
        const component = shallow(<AllPlaylistsPage {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
    });

    it('Should create page heading', () => {
        // act
        const component = shallow(<AllPlaylistsPage {...props}/>);
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Playlists');
    });

    it('Should create list of playlists', () => {
        // act
        const component = shallow(<AllPlaylistsPage {...props}/>);
        component.setState({ isLoading: false });
        const list = component.find('.search-list');
        const listItem = list.find(PlaylistResult);

        // assert
        expect(list.length).toEqual(1);
        expect(listItem.length).toEqual(3);
        expect(listItem.at(0).props().playlist).toEqual(props.playlists[0]);
        expect(listItem.at(1).props().playlist).toEqual(props.playlists[1]);
        expect(listItem.at(2).props().playlist).toEqual(props.playlists[2]);
    });

    it('Should create "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<AllPlaylistsPage {...props}/>);
        component.setState({ isLoading: false });
        const list = component.find('.search-list');
        const link = list.find('a');

        // assert
        expect(link.length).toEqual(1);
        expect(link.find('div').text()).toEqual('View More');
    });

    it('Should load more results when "View More" is clicked', () => {
        // act
        const component = shallow(<AllPlaylistsPage {...props}/>);
        component.setState({ isLoading: false });
        const list = component.find('.search-list');
        const link = list.find('a');

        link.simulate('click');

        // assert
        expect(mockGetNextPlaylists.calledOnce).toEqual(true);
    });
});