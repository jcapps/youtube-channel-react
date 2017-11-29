import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import clearStore from '../../actions/clearAction';
import VideoResult from './VideoResult';

export class AllVideosPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            videoList: props.videoList,
            isLoading: true
        };
        this.getVideos = this.getVideos.bind(this);
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentDidMount() {
        document.title = "Videos";
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isLoading && !nextProps.isLoading) {
            this.setState({
                videoList: this.state.videoList.concat(nextProps.videoList),
                isLoading: false
            });
        }
        if (JSON.stringify(this.props.playlist) != JSON.stringify(nextProps.playlist)) {
            this.getVideos(nextProps);
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    getVideos(props) {
        this.setState({isLoading: true});

        let videoIds = [];
        for (let i = this.state.videoList.length; i < props.playlist.length; i++) {
            const playlistItem = props.playlist[i];
            const videoId = playlistItem.snippet.resourceId.videoId;
            videoIds.push(videoId);
        }
        const videoIdString = videoIds.join(',');

        this.props.actions.getVideo(videoIdString, videoTypes.QUEUED);
    }

    loadMoreVideos() {
        this.setState({isLoading: true});
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
        const loadingSpinner = require('../../images/loading.gif');
        if (this.props.isLoading) return (
            <div>
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );

        let hiddenClass = 'hidden';
        if (this.state.isLoading) {
            hiddenClass = '';
        }
        
        const videoList = this.state.videoList;
        return (
            <div className="search-results">
                <h2>Videos</h2>
                <div className="search-list">
                    {videoList.map((video, i) => {
                        return <VideoResult video={video} key={i}/>;
                    })}
                    {this.renderViewMore()}
                </div>
                <img className={`loading-spinner ${hiddenClass}`} src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

AllVideosPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    videoPageToken: PropTypes.object.isRequired,
    videoList: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    clearStore: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    const totalCallsInProgress = 
        state.ajaxCallsInProgress.allVideos +
        state.ajaxCallsInProgress.searchResults;

    return { 
        playlist: state.playlist,
        playlistId: state.recentUploadsPlaylistId,
        videoPageToken: state.videoPageToken,
        videoList: state.video.queued,
        isLoading: totalCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, videoActions, playlistActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearStore: bindActionCreators(clearStore, dispatch)
    };
}

export function mergeProps(state, actions, props) {
    if (!state.isLoading && state.playlist.length == 0) {
        state.isLoading = true;
        actions.actions.getRecentUploadsPlaylist();
    }
    return Object.assign({}, state, actions, props);
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            (!next.isLoading) &&
            (
                (prev.videoPageToken !== next.videoPageToken) ||
                (prev.videoList !== next.videoList)
            )
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(AllVideosPage);