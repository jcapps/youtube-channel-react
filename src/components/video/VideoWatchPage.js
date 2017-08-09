import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import VideoPlayer from '../common/player/VideoPlayer';

export class VideoWatchPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId, videoTypes.CURRENT);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) return <div/>;
        const video = this.props.video;
        return(
            <div id="videos-watch-page">
                <VideoPlayer video={this.props.video}/>
            </div>
        );
    }
}

VideoWatchPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        video: state.video.current,
        videoId: ownProps.match.params.id,
        isLoading: state.ajaxCallsInProgress.watch > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return prev.isLoading === next.isLoading;
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(VideoWatchPage);