import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import {PlaylistPage} from '../../../src/components/playlist/PlaylistPage';
import VideoThumbnail from '../../../src/components/playlist/VideoThumbnail';
import VideoPlayer from '../../../src/components/common/player/VideoPlayer';
import * as playlistActions from '../../../src/actions/playlistActions';
import * as videoActions from '../../../src/actions/videoActions';

describe('Playlist Page', () => {
    let props;
    let mockGetPlaylist;
    let mockGetNextVideos;
    let mockGetPlaylistInfo;
    let mockGetVideo;
    beforeEach(() => {
        // arrange
        props = {
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
            videoPageToken: {nextPageToken: 'TOKEN'},
            currentVideo: {
                snippet: {
                    title: 'Video Title',
                    description: 'Video Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
            }}}},
            playlistActions: playlistActions,
            videoActions: videoActions
        };

        mockGetPlaylist = sinon.stub(props.playlistActions, 'getPlaylist');
        mockGetPlaylist.returns(new Promise((resolve, reject) => {
            resolve();
        }));
        
        mockGetNextVideos = sinon.stub(props.playlistActions, 'getNextVideos');
        mockGetNextVideos.returns(new Promise((resolve, reject) => {
            resolve();
        }));

        mockGetPlaylistInfo = sinon.stub(props.playlistActions, 'getPlaylistInfo');
        mockGetPlaylistInfo.returns(new Promise((resolve, reject) => {
            resolve();
        }));

        mockGetVideo = sinon.stub(props.videoActions, 'getVideo');
        mockGetVideo.returns(new Promise((resolve, reject) => {
            resolve();
        }));
    });

    afterEach(() => {
        mockGetPlaylist.restore();
        mockGetNextVideos.restore();
        mockGetPlaylistInfo.restore();
        mockGetVideo.restore();
    });

    it('Should create an empty div if still loading', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        const div = component.find('div');
        
        // assert
        expect(div.length).toEqual(1);
        expect(div.text()).toEqual('');
    });

    it('Should create playlist title', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const title = component.find('h2').text();

        // assert
        expect(title).toEqual('Playlist Title');
    });

    it('Should create the video list', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const videoList = component.find('#video-list');
        const videoDivs = videoList.children('div');

        const video1 = props.playlist[0].snippet;
        const video2 = props.playlist[1].snippet;

        // assert
        expect(videoList.length).toEqual(1);
        expect(videoDivs.length).toEqual(2);
        expect(videoDivs.at(0).hasClass('playlist-video')).toEqual(true);
        expect(videoDivs.at(1).hasClass('playlist-video')).toEqual(true);
        expect(videoDivs.at(0).hasClass('selected')).toEqual(true);
        expect(videoDivs.at(1).hasClass('selected')).toEqual(false);
        expect(videoDivs.at(0).prop('id')).toEqual(0);
        expect(videoDivs.at(1).prop('id')).toEqual(1);
        expect(videoDivs.at(0).find(VideoThumbnail).length).toEqual(1);
        expect(videoDivs.at(1).find(VideoThumbnail).length).toEqual(1);
        expect(videoDivs.at(0).find(VideoThumbnail).prop('videoId')).toEqual(video1.resourceId.videoId);
        expect(videoDivs.at(1).find(VideoThumbnail).prop('videoId')).toEqual(video2.resourceId.videoId);
        expect(videoDivs.at(0).find(VideoThumbnail).prop('playlistIndex')).toEqual(video1.position);
        expect(videoDivs.at(1).find(VideoThumbnail).prop('playlistIndex')).toEqual(video2.position);
    });

    it('Should create a "View More" link if nextPageToken exists', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const videoList = component.find('#video-list');
        const viewMoreLink = videoList.find('a');

        // assert
        expect(viewMoreLink.length).toEqual(1);
        expect(viewMoreLink.find('div').text()).toEqual('View More');
    });

    it('Should not create a "View More" link if no nextPageToken exists', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: '',
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const videoList = component.find('#video-list');
        const viewMore = videoList.find('a');

        // assert
        expect(viewMore.length).toEqual(0);
    });

    it('Should create a VideoPlayer', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const player = component.find(VideoPlayer);
        const updatePlaylist = component.instance().updatePlaylist;

        // assert
        expect(player.length).toEqual(1);
        expect(player.prop('video')).toEqual(props.currentVideo);
        expect(player.prop('playlistIndex')).toEqual(0);
        expect(player.prop('playlistId')).toEqual(props.playlistId);
        expect(player.prop('updatePlaylist')).toEqual(updatePlaylist);
    });

    it('Should display "No videos found for this playlist" if playlist is empty', () => {
        // arrange
        props.playlist = [];

        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            isLoading: false
        });
        
        // assert
        expect(component.text()).toEqual('(No videos found for this playlist.)');
    });

    it('Should change video on VideoThumbnail click', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        let videoList = component.find('#video-list');
        const nextVideo = videoList.children('div').at(1);
        const mockTarget = {id: nextVideo.prop('id'), className: 'playlist-video'}
        
        mockGetVideo.returns(new Promise((resolve, reject) => {
            component.setState({videoInPlaylist: parseInt(mockTarget.id)});
            resolve();
        }));

        nextVideo.simulate('click', {target: mockTarget});

        videoList = component.find('#video-list');
        const videoDivs = videoList.children('div');
        const player = component.find(VideoPlayer);

        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
        expect(mockGetVideo.getCalls()[0].args).toEqual(['1']);
        expect(videoDivs.at(0).hasClass('selected')).toEqual(false);
        expect(videoDivs.at(1).hasClass('selected')).toEqual(true);
        expect(player.prop('playlistIndex')).toEqual(1);
    });

    it('Should update playlist on state change', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const playlistIndex = 1;
        component.instance().updatePlaylist(playlistIndex);

        // assert
        expect(mockGetVideo.calledOnce).toEqual(true);
        expect(mockGetVideo.getCalls()[0].args).toEqual(['1']);
    });

    it('Should load more videos when "View More" is clicked', () => {
        // act
        const component = shallow(<PlaylistPage {...props}/>);
        component.setState({
            playlist: props.playlist,
            playlistInfo: props.playlistInfo,
            videoPageToken: props.videoPageToken,
            currentVideo: props.currentVideo,
            isLoading: false
        });
        const videoList = component.find('#video-list');
        const viewMoreLink = videoList.find('a');

        viewMoreLink.simulate('click'); 

        // assert
        expect(mockGetNextVideos.calledOnce).toEqual(true);
        expect(mockGetNextVideos.getCalls()[0].args)
            .toEqual([props.playlistId, props.videoPageToken.nextPageToken]);
    });
});