import React, {PropTypes} from 'react';
import YouTubePlayer from 'youtube-player';

let player;

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let params = {
            height: '360',
            width: '640',
            videoId: this.props.video.id
        };

        if (this.props.playlistId) {
            params = {
                height: '360',
                width: '640',
                playerVars: {
                    listType: 'playlist',
                    list: this.props.playlistId
                }
            };
        }
        
        player = YouTubePlayer('player-iframe', params);
        player.on('ready', e => {
            let playlistIndex = e.target.getPlaylistIndex(); // -1 if not a playlist
            if (playlistIndex > -1) {
                player.playVideoAt(this.props.playlistIndex);
            }
        });
        player.on('stateChange', e => {
            let playlistIndex = e.target.getPlaylistIndex(); // -1 if not a playlist
            if (playlistIndex > -1) {
                this.props.updatePlaylist(playlistIndex);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlistIndex != nextProps.playlistIndex) {
            player.playVideoAt(nextProps.playlistIndex);
        }
    }

    render() {
        let videoDescription = this.props.video.snippet.description.split("\n");

        return (
            <div className="video-player">
                <div id="player-iframe"></div>
                <div className="video-details">
                    <h3>{this.props.video.snippet.title}</h3>
                    <hr/>
                    <p>
                        {videoDescription.map(piece => {
                            return (
                                <span key={piece}>{piece}<br/></span>
                            );
                        })}
                    </p>
                </div>
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