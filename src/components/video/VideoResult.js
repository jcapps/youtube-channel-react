import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';

export class VideoResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            video: Object.assign({}),
            isLoading: true
        };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId, videoTypes.QUEUED);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.videoId == nextProps.video.id) { // Avoid race condition in IE
            this.setState({ 
                video: Object.assign({}, nextProps.video),
                isLoading: false
            });
        }

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
        if (video.snippet) {
            return (
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
    return { video: state.video.queued };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoResult);