import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import VideoPlayer from '../common/player/VideoPlayer';
import VideoThumbnail from './VideoThumbnail';

export class PlaylistPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
        this.changeVideo = this.changeVideo.bind(this);
        this.updatePlaylist = this.updatePlaylist.bind(this);
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillMount() {
        this.props.playlistActions.getPlaylistInfo(this.props.playlistId).then(() => {
            this.props.playlistActions.getPlaylist(this.props.playlistId).then(() => {
                if (this.props.playlist.length > 0) {
                    const videoId = this.props.playlist[this.props.videoInPlaylist].snippet.resourceId.videoId;
                    this.props.videoActions.getVideo(videoId, videoTypes.CURRENT).then(() => {
                        this.setState({ isLoading: false });
                    });
                }
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlistId != nextProps.match.params.id) {
            this.props.playlistActions.getPlaylistInfo(nextProps.match.params.id).then(() => {
                this.props.playlistActions.getPlaylist(nextProps.match.params.id).then(() => {
                    if (this.props.playlist.length > 0) {
                        const videoId = this.props.playlist[0].snippet.resourceId.videoId;
                        this.props.videoActions.getVideo(videoId, videoTypes.CURRENT).then(() => {
                            this.setState({ isLoading: false });
                        });
                    }
                });
            });
        }
    }

    changeVideo(e) {
        let element = e.target;
        while (element.className.indexOf("playlist-video") < 0) {
            element = element.parentNode;
        }
        const videoId = this.props.playlist[element.id].snippet.resourceId.videoId;
        this.props.videoActions.getVideo(videoId, videoTypes.CURRENT, parseInt(element.id));
    }

    updatePlaylist(playlistIndex) {
        const nowPlaying = this.props.videoInPlaylist;
        if (nowPlaying != playlistIndex) {
            const videoId = this.props.playlist[playlistIndex].snippet.resourceId.videoId;
            this.props.videoActions.getVideo(videoId, videoTypes.CURRENT, parseInt(playlistIndex));
        }
    }

    loadMoreVideos() {
        const nextPageToken = this.props.videoPageToken.nextPageToken;
        const id = this.props.playlistId;
        this.props.playlistActions.getNextVideos(id, nextPageToken);
    }

    renderViewMore() {
        if (this.props.videoPageToken.nextPageToken) {
            return (
                <a id="view-more" onClick={this.loadMoreVideos}>
                    <div><b>View More</b></div>
                </a>
            );
        }
    }

    render() {
        if (this.state.isLoading) return <div />;
        const playlist = this.props.playlist;
        const nowPlaying = this.props.videoInPlaylist;
        if (playlist.length > 0) {
            return(
                <div id="playlist-page">
                    <h2>{this.props.playlistInfo.snippet.title}</h2> 
                    <div id="video-list">
                        {playlist.map(playlistItem => {
                            let video = playlistItem.snippet;
                            if (video.position == nowPlaying) {
                                return (
                                    <div className="playlist-video selected" id={nowPlaying} key={nowPlaying} onClick={this.changeVideo}>
                                        <VideoThumbnail videoId={video.resourceId.videoId} playlistIndex={nowPlaying}/>
                                    </div>
                                );
                            }
                            return (
                                <div className="playlist-video" id={video.position} key={video.position} onClick={this.changeVideo}>
                                    <VideoThumbnail videoId={video.resourceId.videoId} playlistIndex={video.position}/>
                                </div>
                            );
                        })}
                        {this.renderViewMore()}
                    </div>
                    <VideoPlayer 
                        video={this.props.currentVideo} 
                        playlistIndex={nowPlaying}
                        playlistId={this.props.playlistId} 
                        updatePlaylist={this.updatePlaylist}/>
                </div>
            );
        }
        return <div>(No videos found for this playlist.)</div>;
    }
}

PlaylistPage.propTypes = {
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    playlistInfo: PropTypes.object.isRequired,
    videoPageToken: PropTypes.object.isRequired,
    videoInPlaylist: PropTypes.number.isRequired,
    currentVideo: PropTypes.object.isRequired,
    playlistActions: PropTypes.object.isRequired,
    videoActions: PropTypes.object.isRequired,
    match: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return { 
        playlist: state.playlist,
        playlistInfo: state.playlistInfo,
        playlistId: ownProps.match.params.id,
        videoPageToken: state.videoPageToken,
        videoInPlaylist: state.playlistIndex,
        currentVideo: state.video.current
    };
}

function mapDispatchToProps(dispatch) {
    return { 
        playlistActions: bindActionCreators(playlistActions, dispatch),
        videoActions: bindActionCreators(videoActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);