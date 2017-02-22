import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import VideoResult from './VideoResult';

class AllVideosPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            playlist: Object.assign([]),
            playlistId: props.playlistId,
            videoPageToken: props.videoPageToken,
            isLoading: true
        };
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillMount() {
        this.props.actions.getRecentUploadsPlaylist().then(() => {
            this.setState({ 
                playlist: Object.assign([], this.props.playlist),
                videoPageToken: Object.assign({}, this.props.videoPageToken),
                isLoading: false
            });
        });
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
        if (this.state.isLoading) return <div></div>;
        return (
            <div id="videos-page">
                <h2>Videos</h2>
                <div id="video-list">
                    {playlist.map(video => {
                        const id = video.snippet.resourceId.videoId;
                        return (
                            <Link to={"/watch/" + id} key={id}>
                                <VideoResult videoId={id}/>
                            </Link>
                        );
                    })}
                    {this.renderViewMore()}
                </div>
            </div>
        );
    }
}

AllVideosPage.propTypes = {
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    videoPageToken: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { 
        playlist: state.playlist,
        playlistId: state.recentUploadsPlaylistId,
        videoPageToken: state.videoPageToken
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllVideosPage);