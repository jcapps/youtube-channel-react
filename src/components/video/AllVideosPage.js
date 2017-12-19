import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import * as videoTypes from '../../reducers/videoTypes';
import clearStore from '../../actions/clearAction';
import VideoResult from './VideoResult';

export class AllVideosPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.loadMoreVideos = this.loadMoreVideos.bind(this);
    }

    componentWillMount() {
        this.props.actions.getRecentUploadsPlaylist();
    }

    componentDidMount() {
        document.title = "Videos";
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({isLoading: false});
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
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

    renderContent() {
        const playlist = this.props.playlist;
        return (
            <div>
                <h2>Videos</h2>
                <div className="search-list">
                    {playlist.map((video, i) => {
                        video.id = video.snippet.resourceId.videoId;
                        return <VideoResult video={video} key={video.id}/>;
                    })}
                    {this.renderViewMore()}
                </div>
            </div>
        );
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
        
        return (
            <div className="search-results">
                {this.renderContent()}
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
    actions: PropTypes.object.isRequired,
    clearStore: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    return {
        playlist: state.playlist,
        playlistId: state.recentUploadsPlaylistId,
        videoPageToken: state.videoPageToken,
        isLoading: state.ajaxCallsInProgress.allVideos > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(playlistActions, dispatch),
        clearStore: bindActionCreators(clearStore, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            (!next.isLoading) &&
            (prev.videoPageToken !== next.videoPageToken)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AllVideosPage);