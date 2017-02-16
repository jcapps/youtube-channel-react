import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';

class PlaylistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlist: Object.assign([], props.playlist),
            playlistId: props.playlistId
        };
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
        return(
            <div id="playlist-page">
                {this.state.playlist.map(playlistItem => 
                    <div key={playlistItem.snippet.resourceId.videoId}>{playlistItem.snippet.title}</div>)}
            </div>
        );
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