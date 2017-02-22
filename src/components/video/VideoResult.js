import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoThumbnail from '../common/VideoThumbnail';

class VideoResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = { video: Object.assign({}) };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId).then(() => {
            this.setState({ video: Object.assign({}, this.props.video) });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.videoId != nextProps.videoId) {
            this.props.actions.getVideo(nextProps.videoId).then(() => {
                this.setState({ video: Object.assign({}, this.props.video) });
            });
        }
    }

    render() {
        let video = this.state.video;
        if (video.snippet) {
            return (
                <div className="video-thumbnail">
                    <VideoThumbnail videoId={video.id}/>
                    <div>
                        <h4>{video.snippet.title}</h4>
                        <p>{video.snippet.description}</p>
                    </div>
                </div>
            );
        }
        return <div>(Can't find video)</div>;
    }
}

VideoResult.propTypes = {
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { video: state.video };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoResult);