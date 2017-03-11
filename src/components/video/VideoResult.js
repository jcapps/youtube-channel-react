import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';

export class VideoResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            video: Object.assign({}),
            isLoading: true
        };
    }

    componentWillMount() {
        this.props.actions.getVideo(this.props.videoId).then(() => {
            this.setState({ 
                video: Object.assign({}, this.props.video),
                isLoading: false
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.videoId != nextProps.videoId) {
            this.props.actions.getVideo(nextProps.videoId).then(() => {
                this.setState({ 
                    video: Object.assign({}, this.props.video),
                    isLoading: false
                });
            });
        }
    }

    render() {
        if (this.state.isLoading) return <div></div>;
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
    return { video: state.video };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoResult);