import React, {PropTypes} from 'react';

const VideoPlayerDescription = ({video, videoDescription}) => {
    let description = videoDescription.split("\n");

    return (
        <div className="video-details">
            <h3>{video.snippet.title}</h3>
            <hr/>
            <p>
                {description.map(piece => {
                    return (
                        <span key={piece}>{piece}<br/></span>
                    );
                })}
            </p>
        </div>
    );
};

VideoPlayerDescription.propTypes = {
    video: PropTypes.object.isRequired,
    videoDescription: PropTypes.string.isRequired
};

export default VideoPlayerDescription;