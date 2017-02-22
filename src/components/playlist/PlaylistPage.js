import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import VideoPlayer from '../common/VideoPlayer';
import VideoThumbnail from '../common/VideoThumbnail';

class PlaylistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            playlist: Object.assign([]),
            playlistInfo: Object.assign({}),
            videoPageToken: Object.assign({}),
            videoInPlaylist: props.videoInPlaylist
        };
        this.changeVideo = this.changeVideo.bind(this);
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillMount() {
        this.props.actions.getPlaylist(this.props.playlistId).then(() => {
            this.setState({ 
                playlist: Object.assign([], this.props.playlist),
                videoPageToken: Object.assign({}, this.props.videoPageToken)
            });
        });
        this.props.actions.getPlaylistInfo(this.props.playlistId).then(() => {
            this.setState({ playlistInfo: Object.assign({}, this.props.playlistInfo) });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlistId != nextProps.params.id) {
            this.props.actions.getPlaylist(nextProps.params.id).then(() => {
                this.setState({ 
                    playlist: Object.assign([], this.props.playlist),
                    videoPageToken: Object.assign({}, this.props.videoPageToken),
                    videoInPlaylist: 0
                });
            });
            this.props.actions.getPlaylistInfo(nextProps.params.id).then(() => {
                this.setState({ playlistInfo: Object.assign({}, this.props.playlistInfo) });
            });
        }
    }

    changeVideo(e) {
        this.setState({ videoInPlaylist: e.target.parentNode.id });
    }

    loadMoreVideos() {
        const nextPageToken = this.state.videoPageToken.nextPageToken;
        const id = this.props.playlistId;
        this.props.actions.getNextVideos(id, nextPageToken).then(() => {
            this.setState({ 
                playlist: Object.assign([], this.props.playlist),
                videoPageToken: Object.assign({}, this.props.videoPageToken)
            });
        });
    }

    renderViewMore() {
        if (this.state.videoPageToken.nextPageToken) {
            return (
                <a id="view-more" onClick={this.loadMoreVideos}>
                    <div>View More</div>
                </a>
            );
        }
    }

    render() {
        const playlist = this.state.playlist;
        const nowPlaying = this.state.videoInPlaylist;
        if (playlist.length > 0) {
            return(
                <div id="playlist-page">
                    <h2>{this.state.playlistInfo.snippet.title}</h2>
                    <VideoPlayer videoId={playlist[nowPlaying].snippet.resourceId.videoId} videoTitle={playlist[nowPlaying].snippet.title}/>
                    <br/>
                    <div id="video-list">
                        {playlist.map(playlistItem => {
                            let video = playlistItem.snippet;
                            if (video.position == nowPlaying) {
                                return (
                                    <div className="playlist-video selected" id={nowPlaying} key={nowPlaying} onClick={this.changeVideo}>
                                        <VideoThumbnail videoId={video.resourceId.videoId}/>
                                    </div>
                                );
                            }
                            return (
                                <div className="playlist-video" id={video.position} key={video.position} onClick={this.changeVideo}>
                                    <VideoThumbnail videoId={video.resourceId.videoId}/>
                                </div>
                            );
                        })}
                        {this.renderViewMore()}
                    </div>
                </div>
            );
        }
        return <div>(No videos found for this playlist.)</div>;
    }
}

PlaylistPage.propTypes = {
    playlist: PropTypes.array.isRequired,
    playlistInfo: PropTypes.object.isRequired,
    playlistId: PropTypes.string.isRequired,
    videoPageToken: PropTypes.object.isRequired,
    videoInPlaylist: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return { 
        playlist: state.playlist,
        playlistInfo: state.playlistInfo,
        playlistId: ownProps.params.id,
        videoPageToken: state.videoPageToken,
        videoInPlaylist: state.videoInPlaylist
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);