import React, {PropTypes} from 'react';
import YouTubePlayer from 'youtube-player';
import VideoPlayerDescription from './VideoPlayerDescription';
import VideoPlayerStats from './VideoPlayerStats';

let player;

class VideoPlayer extends React.Component {
    componentDidMount() {
        this.initializePlayer(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlistId != nextProps.playlistId) {
            this.initializePlayer(nextProps);
        }
        if (this.props.playlistIndex != nextProps.playlistIndex) {
            player.playVideoAt(nextProps.playlistIndex);
        }
    }

    initializePlayer(props) {
        let params = {
            height: '360',
            width: '640',
            videoId: props.video.id
        };

        if (props.playlistId) {
            params = {
                height: '360',
                width: '640',
                playerVars: {
                    listType: 'playlist',
                    list: props.playlistId
                }
            };
        }
        
        if (player) player.destroy();
        player = YouTubePlayer('player-iframe', params);
        player.on('stateChange', e => {
            let playlistIndex = e.target.getPlaylistIndex(); // -1 if not a playlist
            if (playlistIndex > -1) {
                props.updatePlaylist(playlistIndex);
            }
        });
    }

    render() {
        return (
            <div className="video-player">
                <div id="player-iframe"></div>
                <VideoPlayerStats video={this.props.video} />
                <VideoPlayerDescription video={this.props.video} />
            </div>
        );
    }
}

VideoPlayer.propTypes = {
    video: PropTypes.object.isRequired,
    playlistIndex: PropTypes.number,
    playlistId: PropTypes.string,
    updatePlaylist: PropTypes.func
};

export default VideoPlayer;