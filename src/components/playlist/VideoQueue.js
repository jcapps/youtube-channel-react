import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import VideoThumbnail from './VideoThumbnail';

export class VideoQueue extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            videoList: props.videoList,
            isLoading: true
        };
        this.getVideos = this.getVideos.bind(this);
    }

    componentWillMount() {
        this.getVideos(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isLoading && !nextProps.isLoading) {
            this.setState({
                videoList: this.state.videoList.concat(nextProps.videoList),
                isLoading: false
            });
        }
        if (
            this.props.playlistId != nextProps.playlistId ||
            JSON.stringify(this.props.playlist) != JSON.stringify(nextProps.playlist)
        ) {
            this.getVideos(nextProps);
        }
    }

    getVideos(props) {
        this.setState({isLoading: true});

        let startIndex = this.state.videoList.length;
        if (props.playlistId != this.props.playlistId) {
            startIndex = 0;
            this.setState({videoList: []});
        }

        let videoIds = [];
        for (let i = startIndex; i < props.playlist.length; i++) {
            const playlistItem = props.playlist[i];
            const videoId = playlistItem.snippet.resourceId.videoId;
            videoIds.push(videoId);
        }
        const videoIdString = videoIds.join(',');

        this.props.actions.getVideo(videoIdString, videoTypes.QUEUED);
    }

    renderContent() {
        const videoList = this.state.videoList;
        const nowPlayingIndex = this.props.nowPlayingIndex;

        return videoList.map((video, i) => {
            if (i == nowPlayingIndex) {
                return (
                    <div className="playlist-video selected" id={i} key={i} onClick={this.props.changeVideo}>
                        <VideoThumbnail video={video} playlistIndex={i}/>
                    </div>
                );
            }
            return (
                <div className="playlist-video" id={i} key={i} onClick={this.props.changeVideo}>
                    <VideoThumbnail video={video} playlistIndex={i}/>
                </div>
            );
        });
    }

    render() {
        const loadingSpinner = require('../../images/loading.gif');

        if (this.state.videoList.length == 0) return (
            <div>
                <img id="playlist-loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );

        let hiddenClass = 'hidden';
        if (this.state.isLoading) {
            hiddenClass = '';
        }

        return (
            <div>
                {this.renderContent()}
                <img id="playlist-loading-spinner" className={`${hiddenClass}`} src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

VideoQueue.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    playlist: PropTypes.array.isRequired,
    playlistId: PropTypes.string.isRequired,
    nowPlayingIndex: PropTypes.number.isRequired,
    videoList: PropTypes.array.isRequired,
    changeVideo: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        videoList: state.video.queued,
        isLoading: state.ajaxCallsInProgress.watch > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading && prev.videoList !== next.videoList) ||
            (prev.playlist !== next.playlist) ||
            (prev.playlistId != next.playlistId)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(VideoQueue);