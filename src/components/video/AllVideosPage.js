import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import VideoResult from './VideoResult';

export class AllVideosPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillMount() {
        this.props.actions.getRecentUploadsPlaylist();
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
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
        const playlist = this.props.playlist;
        return (
            <div className="search-results">
                <h2>Videos</h2>
                <div className="search-list">
                    {playlist.map(video => {
                        const id = video.snippet.resourceId.videoId;
                        return <VideoResult videoId={id} key={id}/>;
                    })}
                    {this.renderViewMore()}
                </div>
            </div>
        );
    }
}

AllVideosPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    videoPageToken: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { 
        playlist: state.playlist,
        playlistId: state.recentUploadsPlaylistId,
        videoPageToken: state.videoPageToken,
        isLoading: state.ajaxCallsInProgress.allVideos > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return (prev.isLoading === next.isLoading || prev.videoPageToken === next.videoPageToken);
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AllVideosPage);