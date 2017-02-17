import React, {PropTypes} from 'react';

const VideoPlayer = ({videoId}) => {
    const videoUrl = "https://www.youtube.com/embed/" + videoId;
    return <iframe width="640" height="360" src={videoUrl}></iframe>;
};

VideoPlayer.propTypes = {
    videoId: PropTypes.string.isRequired
};

export default VideoPlayer;