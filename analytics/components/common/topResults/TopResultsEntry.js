import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../../actions/playlistActions';
import * as videoActions from '../../../actions/videoActions';

export class TopResultsEntry extends React.PureComponent {
    componentWillMount() {
        if (this.props.videoId) {
            this.props.actions.getVideo(this.props.videoId);
        }
        if (this.props.playlistId) {
            this.props.actions.getPlaylistInfo(this.props.playlistId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.videoId && (this.props.videoId != nextProps.videoId)) {
            this.props.actions.getVideo(nextProps.videoId);
        }
        if (nextProps.playlistId && (this.props.playlistId != nextProps.playlistId)) {
            this.props.actions.getPlaylistInfo(nextProps.playlistId);
        }
    }

    render() {
        let content = this.props.video;
        if (this.props.playlistId) {
            content = this.props.playlist;
        }
        if (!content || !content.snippet) return <td/>;

        return (
            <td>
                <div className="content-title">{content.snippet.title}</div>
            </td>
        );
    }
}

TopResultsEntry.propTypes = {
    video: PropTypes.object,
    videoId: PropTypes.string,
    playlist: PropTypes.object,
    playlistId: PropTypes.string,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state, props) {
    return {
        playlist: state.playlistInfo,
        video: state.video
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, videoActions, playlistActions), dispatch)
    };
}

export function mergeProps(state, actions, props) {
    return Object.assign({}, state, actions, props);
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !(
            !!next.videoId && (prev.videoId != next.videoId ||
            next.videoId == next.video.id) ||
            !!next.playlistId && (prev.playlistId != next.playlistId ||
            next.playlistId == next.playlist.id)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(TopResultsEntry);