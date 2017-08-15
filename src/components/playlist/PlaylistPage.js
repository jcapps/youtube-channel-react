import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import PlaylistPlayer from './PlaylistPlayer';
import VideoThumbnail from './VideoThumbnail';

export class PlaylistPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            playlistIndex: 0,
            isLoading: true
        };
        this.changeVideo = this.changeVideo.bind(this);
        this.updatePlaylist = this.updatePlaylist.bind(this);
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoading) {
            this.setState({ isLoading: true });
        } else {
            this.setState({
                playlistIndex: nextProps.videoInPlaylist,
                isLoading: false
            });
        }
    }

    changeVideo(e) {
        let element = e.target;
        while (element.className.indexOf("playlist-video") < 0) {
            element = element.parentNode;
        }
        this.setState({ playlistIndex: parseInt(element.id) });
    }

    updatePlaylist(playlistIndex) {
        const nowPlaying = this.state.playlistIndex;
        if (nowPlaying != playlistIndex) {
            this.setState({ playlistIndex: parseInt(playlistIndex) });
        }
    }

    loadMoreVideos() {
        const nextPageToken = this.props.videoPageToken.nextPageToken;
        const id = this.props.playlistId;
        this.props.actions.getNextVideos(id, nextPageToken);
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
        if (this.state.isLoading) return <div/>;
        const playlist = this.props.playlist;
        const nowPlaying = this.state.playlistIndex;
        if (playlist.length > nowPlaying) {
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
                    <PlaylistPlayer 
                        videoId={playlist[nowPlaying].snippet.resourceId.videoId}
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
    isLoading: PropTypes.bool.isRequired,
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    playlistInfo: PropTypes.object.isRequired,
    videoPageToken: PropTypes.object.isRequired,
    videoInPlaylist: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object
};

export function mapStateToProps(state, ownProps) {
    return { 
        playlist: state.playlist,
        playlistInfo: state.playlistInfo,
        playlistId: ownProps.match.params.id,
        videoPageToken: state.videoPageToken,
        videoInPlaylist: state.playlistIndex,
        isLoading: state.ajaxCallsInProgress.playlist > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return { 
        actions: bindActionCreators(playlistActions, dispatch)
    };
}

export function mergeProps(state, actions, props) {
    if (state.playlistId != state.playlistInfo.id) {
        state.isLoading = true;
        actions.actions.getPlaylistInfo(state.playlistId);
        actions.actions.getPlaylist(state.playlistId);
    }
    return Object.assign({}, state, actions, props);
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            (!next.isLoading) || 
            (next.isLoading && next.playlistInfo.id !== next.playlistId)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(PlaylistPage);