import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {PlaylistPage} from '../../../src/components/playlist/PlaylistPage';
import VideoQueue from '../../../src/components/playlist/VideoQueue';
import VideoThumbnail from '../../../src/components/playlist/VideoThumbnail';
import PlaylistPlayer from '../../../src/components/playlist/PlaylistPlayer';
import * as playlistActions from '../../../src/actions/playlistActions';

describe('Playlist Page', () => {
    let props;
    let mockGetPlaylist;
    let mockGetPlaylistInfo;
    let mockGetNextVideos;

    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            playlist: [
                {snippet: {
                    position: 0,
                    resourceId: {videoId: '0'}
                }},
                {snippet: {
                    position: 1,
                    resourceId: {videoId: '1'}
                }}
            ],
            playlistInfo: {snippet: {title: 'Playlist Title'}},
            playlistId: '1',
            videoPageToken: {prevPageToken: '', nextPageToken: 'TOKEN'},
            playlistIndex: 0,
            actions: playlistActions
        };
        
        mockGetPlaylist = sinon.stub(playlistActions, 'getPlaylist');
        mockGetPlaylist.resolves();

        mockGetPlaylistInfo = sinon.stub(playlistActions, 'getPlaylistInfo');
        mockGetPlaylistInfo.resolves();

        mockGetNextVideos = sinon.stub(props.actions, 'getNextVideos');
        mockGetNextVideos.resolves();
    });

    afterEach(() => {
        mockGetPlaylist.restore();
        mockGetPlaylistInfo.restore();
        mockGetNextVideos.restore();
    });

    it ('Should getPlaylist and getPlaylistInfo on mount', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        
        // assert
        expect(mockGetPlaylist.calledOnce).toEqual(true);
        expect(mockGetPlaylistInfo.calledOnce).toEqual(true);
    });

    it('Should create a div with loading spinner if still loading', () => {
        // arrange
        props.isLoading = true;

        // act
        const component = shallow(<PlaylistPage {...props}/>);
        const children = component.children('');
        
        // assert
        expect(children.length).toEqual(1);
        expect(children.type()).toEqual('img');
    });

    it('Should create playlist title', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Playlist Title');
    });

    it('Should create VideoQueue', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        const videoList = component.find('#video-list');
        const videoQueue = videoList.find(VideoQueue);

        // assert
        expect(videoQueue.length).toEqual(1);
    });

    it('Should create a "View More" link if nextPageToken exists', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        const videoList = component.find('#video-list');
        const viewMoreLink = videoList.find('a');

        // assert
        expect(viewMoreLink.length).toEqual(1);
        expect(viewMoreLink.find('div').text()).toEqual('View More');
    });

    it('Should not create a "View More" link if no nextPageToken exists', () => {
        // arrange
        props.videoPageToken = {prevPageToken: '', nextPageToken: ''};

        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        const videoList = component.find('#video-list');
        const viewMore = videoList.find('a');

        // assert
        expect(viewMore.length).toEqual(0);
    });

    it('Should create a PlaylistPlayer', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        const player = component.find(PlaylistPlayer);
        const updatePlaylist = component.instance().updatePlaylist;

        // assert
        expect(player.length).toEqual(1);
        expect(player.prop('videoId')).toEqual(props.playlist[0].snippet.resourceId.videoId);
        expect(player.prop('playlistIndex')).toEqual(0);
        expect(player.prop('playlistId')).toEqual(props.playlistId);
        expect(player.prop('updatePlaylist')).toEqual(updatePlaylist);
    });

    it('Should display "No videos found for this playlist" if playlist is empty', () => {
        // arrange
        props.playlist = [];

        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        
        // assert
        expect(component.text()).toEqual('(No videos found for this playlist.)');
    });

    it('Should getPlaylist and getPlaylistInfo when receives new playlistId', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);

        mockGetPlaylist.reset();
        mockGetPlaylistInfo.reset();
        component.setProps({ playlistId: '2' });
        
        // assert
        expect(mockGetPlaylist.calledOnce).toEqual(true);
        expect(mockGetPlaylistInfo.calledOnce).toEqual(true);
    });
    
    it('Should change video on VideoThumbnail click', () => {
        // arrange
        const playlistIndex = 1;

        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });

        const mockTarget = {id: playlistIndex, className: 'playlist-video'};
        component.instance().changeVideo({ target: mockTarget });

        const player = component.find(PlaylistPlayer);

        // assert
        expect(player.props().playlistIndex).toEqual(playlistIndex);
    });

    it('Should update playlist on state change', () => {
        // arrange
        const playlistIndex = 1;

        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });

        component.instance().updatePlaylist(playlistIndex);

        const videoList = component.find('#video-list');
        const videoDivs = videoList.children('div');
        const player = component.find(PlaylistPlayer);

        // assert
        expect(player.props().playlistIndex).toEqual(playlistIndex);
    });

    it('Should load more videos when "View More" is clicked', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({ isLoading: false });
        const videoList = component.find('#video-list');
        const viewMoreLink = videoList.find('a');

        viewMoreLink.simulate('click'); 

        // assert
        expect(mockGetNextVideos.calledOnce).toEqual(true);
        expect(mockGetNextVideos.getCalls()[0].args)
            .toEqual([props.playlistId, props.videoPageToken.nextPageToken]);
    });
});