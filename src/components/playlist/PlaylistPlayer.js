import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import VideoPlayer from '../common/player/VideoPlayer';

export class PlaylistPlayer extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) return <div/>;
        return (
            <VideoPlayer 
                video={this.props.video} 
                playlistIndex={this.props.playlistIndex}
                playlistId={this.props.playlistId} 
                updatePlaylist={this.props.updatePlaylist}/>
        );
    }
}

PlaylistPlayer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    playlistId: PropTypes.string.isRequired,
    playlistIndex: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired,
    video: PropTypes.object.isRequired,
    updatePlaylist: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        video: state.video.current,
        isLoading: state.ajaxCallsInProgress.watch > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { 
        actions: bindActionCreators(videoActions, dispatch)
    };
}

function mergeProps(state, actions, props) {
    if (props.videoId != state.video.id) {
        state.isLoading = true;
        actions.actions.getVideo(props.videoId, videoTypes.CURRENT, props.playlistIndex);
    }
    return Object.assign({}, state, actions, props);
}

const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !( // if the condition below is true, then return false to render
            (!next.isLoading) || 
            (!next.isLoading && next.videoId !== next.video.id)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(PlaylistPlayer);