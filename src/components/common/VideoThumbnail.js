import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';

class VideoThumbnail extends React.Component {
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
                <img 
                    height="90" 
                    width="160" 
                    title={video.snippet.title} 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title}/>
            );
        }
        return <div>(Can't find video)</div>;
    }
}

VideoThumbnail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoThumbnail);