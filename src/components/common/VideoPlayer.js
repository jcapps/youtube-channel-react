import React, {PropTypes} from 'react';

const VideoPlayer = ({videoId, videoTitle}) => {
    const videoUrl = "https://www.youtube.com/embed/" + videoId;
    return (
        <div className="video-player">
            <iframe width="640" height="360" src={videoUrl}></iframe>
            <h3>{videoTitle}</h3>
        </div>
    );
};

VideoPlayer.propTypes = {
    videoId: PropTypes.string.isRequired,
    videoTitle: PropTypes.string.isRequired
};

export default VideoPlayer;