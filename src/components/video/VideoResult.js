import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';

export class VideoResult extends React.PureComponent {
    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId, videoTypes.QUEUED);
    }

    render() {
        const video = this.props.video;
        const isLoading = !video.snippet;
        if (isLoading) return <div/>;
        return (
            <Link to={"/watch/" + video.id}>
                <div className="video-result">
                    <img 
                        height="90" 
                        width="160" 
                        title={video.snippet.title} 
                        src={video.snippet.thumbnails.medium.url} 
                        alt={video.snippet.title}/>
                    <div>
                        <h4>{video.snippet.title}</h4>
                        <p>{video.snippet.description}</p>
                    </div>
                </div>
            </Link>
        );
    }
}

VideoResult.propTypes = {
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { video: state.video.queued };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

function mergeProps(state, actions, props) {
    return Object.assign({}, state, actions, props);
}

const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return next.videoId !== next.video.id; // Only want to render when these two values are the same. (Returning false causes a re-render.)
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(VideoResult);