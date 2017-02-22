import React, {PropTypes} from 'react';

const VideoPlayer = ({video}) => {
    const videoUrl = "https://www.youtube.com/embed/" + video.id;
    return (
        <div className="video-player">
            <iframe width="640" height="360" src={videoUrl}></iframe>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
        </div>
    );
};

VideoPlayer.propTypes = {
    video: PropTypes.object.isRequired
};

export default VideoPlayer;