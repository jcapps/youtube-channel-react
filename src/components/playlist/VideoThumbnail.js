import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';

export class VideoThumbnail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            video: Object.assign({}),
            isLoading: true
        };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId, videoTypes.QUEUED).then(() => {
            this.setState({ 
                video: Object.assign({}, this.props.video),
                isLoading: false
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.videoId != nextProps.videoId) {
            this.props.actions.getVideo(nextProps.videoId, videoTypes.QUEUED).then(() => {
                this.setState({
                    video: Object.assign({}, this.props.video),
                    isLoading: false
                });
            });
        }
    }

    render() {
        if (this.state.isLoading) return <div />;
        let video = this.state.video;
        let position = +this.props.playlistIndex + 1;
        if (video.snippet) {
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
        return <div>(Can't find video)</div>;
    }
}

VideoThumbnail.propTypes = {
    video: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    playlistIndex: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { video: state.video.queued };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoThumbnail);