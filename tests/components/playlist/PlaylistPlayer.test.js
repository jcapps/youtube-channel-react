import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import VideoPlayer from '../../../src/components/common/player/VideoPlayer';
import {PlaylistPlayer} from '../../../src/components/playlist/PlaylistPlayer';

describe('Playlist Player', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            video: {
                snippet: {
                    title: 'Video Title',
                    description: 'Video Description',
                    thumbnails: {
                        medium: {
                            url: 'test.url'
            }}}},
            videoId: 'ID',
            playlistId: 'PLAYLISTID',
            playlistIndex: 0,
            updatePlaylist: () => {}
        };
    });

    it('Should create an empty div if still loading', () => {
        // act
        const component = shallow(<PlaylistPlayer {...props}/>);
        
        // assert
        expect(component.html()).toEqual('<div></div>');
    });

    it('Should create a VideoPlayer', () => {
        // act
        const component = shallow(<PlaylistPlayer {...props}/>);
        component.setState({ isLoading: false });
        const player = component.find(VideoPlayer);

        // assert
        expect(player.length).toEqual(1);
        expect(player.prop('video')).toEqual(props.video);
        expect(player.prop('playlistIndex')).toEqual(props.playlistIndex);
        expect(player.prop('playlistId')).toEqual(props.playlistId);
        expect(player.prop('updatePlaylist')).toEqual(props.updatePlaylist);
    });
});