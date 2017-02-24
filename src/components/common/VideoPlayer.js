import React, {PropTypes} from 'react';
import YouTubePlayer from 'youtube-player';
import VideoPlayerDescription from './VideoPlayerDescription';

let player;

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
    }

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
        player.on('ready', e => {
            let playlistIndex = e.target.getPlaylistIndex(); // -1 if not a playlist
            if (playlistIndex > -1) {
                player.playVideoAt(props.playlistIndex);
            }
        });
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
                <VideoPlayerDescription 
                    video={this.props.video} 
                    videoDescription={this.props.video.snippet.description}/>
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