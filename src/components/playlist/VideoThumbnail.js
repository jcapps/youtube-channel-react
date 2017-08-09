import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';

export class VideoThumbnail extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId, videoTypes.QUEUED);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) return <div/>;
        let video = this.props.video;
        let position = +this.props.playlistIndex + 1;
        return (
            <div className="video-thumbnail">
                <img 
                    height="67.5" 
                    width="120" 
                    title={video.snippet.title} 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title}/>
                <div>
                    <h3>{position}. {video.snippet.title}</h3>
                    <p>{video.snippet.channelTitle}</p>
                </div>
            </div>
        );
    }
}

VideoThumbnail.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    playlistIndex: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        video: state.video.queued,
        isLoading: !state.video.queued.snippet
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

function mergeProps(state, actions, props) {
    return Object.assign({}, state, actions, props);
}

const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        // Only want to render when these two values are the same. (Returning false causes a re-render.)
        return next.videoId !== next.video.id;
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(VideoThumbnail);