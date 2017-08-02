import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import VideoPlayer from '../common/player/VideoPlayer';

export class VideoWatchPage extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        this.props.actions.getVideo(this.props.videoId, videoTypes.CURRENT).then(() => {
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
        if (this.state.isLoading) return <div />;
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
        video: state.video.current,
        videoId: ownProps.match.params.id,
        isLoading: state.ajaxCallsInProgress > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoWatchPage);