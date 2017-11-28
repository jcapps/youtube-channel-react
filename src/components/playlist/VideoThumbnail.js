import React from 'react';
import PropTypes from 'prop-types';

export class VideoThumbnail extends React.PureComponent {
    render() {
        let video = this.props.video;
        let position = +this.props.playlistIndex + 1;
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
}

VideoThumbnail.propTypes = {
    video: PropTypes.object.isRequired,
    playlistIndex: PropTypes.number.isRequired
};

export default VideoThumbnail;