import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../../actions/videoActions';

export class TopResultsEntry extends React.PureComponent {
    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.videoId != nextProps.videoId) {
            this.props.actions.getVideo(nextProps.videoId);
        }
    }

    render() {
        if (this.props.isLoading) return <td/>;
        return (
            <td>
                <div className="video-title">{this.props.video.snippet.title}</div>
            </td>
        );
    }
}

TopResultsEntry.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state, props) {
    return {
        video: state.video,
        isLoading: state.video.id != props.videoId
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(videoActions, dispatch)
    };
}

export function mergeProps(state, actions, props) {
    return Object.assign({}, state, actions, props);
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !(
            next.videoId == next.video.id ||
            prev.videoId != next.videoId
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(TopResultsEntry);