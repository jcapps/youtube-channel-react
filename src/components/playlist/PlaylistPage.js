import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import VideoPlayer from '../common/VideoPlayer';
import VideoThumbnail from '../common/VideoThumbnail';

class PlaylistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { playlist: Object.assign([], props.playlist) };
    }

    componentWillMount() {
        this.props.actions.getPlaylist(this.props.playlistId).then(() => {
            this.setState({ playlist: Object.assign([], this.props.playlist) });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlistId != nextProps.params.id) {
            this.props.actions.getPlaylist(nextProps.params.id).then(() => {
                this.setState({ playlist: Object.assign([], this.props.playlist) });
            });
        }
    }

    render() {
        if (this.state.playlist.length > 0) {
            return(
                <div id="playlist-page">
                    <VideoPlayer videoId={this.state.playlist[0].snippet.resourceId.videoId}/>
                    <br/>
                    <div id="video-list">
                        {this.state.playlist.map(playlistItem => {
                            let id = playlistItem.snippet.resourceId.videoId;
                            return <VideoThumbnail key={id} videoId={id}/>;
                        })}
                    </div>
                </div>
            );
        }
        return <div>(No videos found for this playlist.)</div>;
    }
}

PlaylistPage.propTypes = {
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return { 
        playlist: state.playlist,
        playlistId: ownProps.params.id
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);