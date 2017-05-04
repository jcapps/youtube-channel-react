import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/VideoPlayer';

export class VideoWatchPage extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        this.props.actions.getVideo(this.props.videoId).then(() => {
            this.setState({ isLoading: this.props.isLoading });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.video.id == nextProps.videoId) {
            this.setState({ isLoading: false });
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.video.id != nextProps.video.id) {
            return true;
        }
        if (!document.getElementById('videos-watch-page')) {
            return true;
        }
        return false;
    }

    render() {
        if (this.state.isLoading) return <div></div>;
        return (
            <div id="videos-watch-page">
                <VideoPlayer video={this.props.video}/>
            </div>
        );
    }
}

VideoWatchPage.propTypes = {
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        video: state.video,
        videoId: ownProps.params.id,
        isLoading: state.ajaxCallsInProgress > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoWatchPage);