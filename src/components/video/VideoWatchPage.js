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

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            document.title = nextProps.video.snippet.title;
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

export function mapStateToProps(state, ownProps) {
    return {
        video: state.video.current,
        videoId: ownProps.match.params.id,
        isLoading: state.ajaxCallsInProgress.watch > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            (!next.isLoading) && 
            (prev.video !== next.video)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(VideoWatchPage);