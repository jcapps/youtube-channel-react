import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/VideoPlayer';

class VideoWatchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            video: Object.assign({})
        };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId).then(() => {
            this.setState({ video: Object.assign({}, this.props.video) });
        });
    }

    render() {
        return (
            <div id="videos-watch-page">
                <VideoPlayer videoId={this.props.videoId} videoTitle={this.state.video.snippet.title}/>
            </div>
        );
    }
}

VideoWatchPage.propTypes = {
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        video: state.video,
        videoId: ownProps.params.id
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoWatchPage);