import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/VideoPlayer';
import VideoThumbnail from './VideoThumbnail';

class PlaylistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            playlist: Object.assign([]),
            playlistInfo: Object.assign({}),
            videoPageToken: Object.assign({}),
            videoInPlaylist: props.videoInPlaylist,
            currentVideo: Object.assign({}),
            isLoading: true
        };
        this.changeVideo = this.changeVideo.bind(this);
        this.updatePlaylist = this.updatePlaylist.bind(this);
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillMount() {
        this.props.playlistActions.getPlaylist(this.props.playlistId).then(() => {
            this.setState({ 
                playlist: Object.assign([], this.props.playlist),
                videoPageToken: Object.assign({}, this.props.videoPageToken)
            });
            const videoId = this.props.playlist[this.props.videoInPlaylist].snippet.resourceId.videoId;
            this.props.videoActions.getVideo(videoId).then(() => {
                this.setState({
                    currentVideo: Object.assign({}, this.props.currentVideo),
                    isLoading: false
                });
            });
        });
        this.props.playlistActions.getPlaylistInfo(this.props.playlistId).then(() => {
            this.setState({ playlistInfo: Object.assign({}, this.props.playlistInfo) });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlistId != nextProps.params.id) {
            this.props.playlistActions.getPlaylist(nextProps.params.id).then(() => {
                this.setState({ 
                    playlist: Object.assign([], this.props.playlist),
                    videoPageToken: Object.assign({}, this.props.videoPageToken),
                    videoInPlaylist: 0
                });
                const videoId = this.props.playlist[0].snippet.resourceId.videoId;
                this.props.videoActions.getVideo(videoId).then(() => {
                    this.setState({
                        currentVideo: Object.assign({}, this.props.currentVideo),
                        isLoading: false
                    });
                });
            });
            this.props.playlistActions.getPlaylistInfo(nextProps.params.id).then(() => {
                this.setState({ playlistInfo: Object.assign({}, this.props.playlistInfo) });
            });
        }
    }

    changeVideo(e) {
        let element = e.target;
        while (!element.classList.contains("playlist-video")) {
            element = element.parentNode;
        }
        const videoId = this.state.playlist[element.id].snippet.resourceId.videoId;
        this.props.videoActions.getVideo(videoId).then(() => {
            this.setState({
                currentVideo: Object.assign({}, this.props.currentVideo),
                videoInPlaylist: element.id,
                isLoading: false
            });
        });
    }

    updatePlaylist(playlistIndex) {
        const nowPlaying = this.state.videoInPlaylist;
        if (nowPlaying != playlistIndex) {
            this.setState({videoInPlaylist: playlistIndex});
        }
    }

    loadMoreVideos() {
        const nextPageToken = this.state.videoPageToken.nextPageToken;
        const id = this.props.playlistId;
        this.props.playlistActions.getNextVideos(id, nextPageToken).then(() => {
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
        if (this.state.isLoading) return <div></div>;
        const playlist = this.state.playlist;
        const nowPlaying = this.state.videoInPlaylist;
        if (playlist.length > 0) {
            return(
                <div id="playlist-page">
                    <h2>{this.state.playlistInfo.snippet.title}</h2>
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
                    <VideoPlayer video={this.state.currentVideo} playlistId={this.props.playlistId} updatePlaylist={this.updatePlaylist}/>
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
    currentVideo: PropTypes.object.isRequired,
    playlistActions: PropTypes.object.isRequired,
    videoActions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return { 
        playlist: state.playlist,
        playlistInfo: state.playlistInfo,
        playlistId: ownProps.params.id,
        videoPageToken: state.videoPageToken,
        videoInPlaylist: state.videoInPlaylist,
        currentVideo: state.video
    };
}

function mapDispatchToProps(dispatch) {
    return { 
        playlistActions: bindActionCreators(playlistActions, dispatch),
        videoActions: bindActionCreators(videoActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);