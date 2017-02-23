import React, {PropTypes} from 'react';

const VideoPlayer = ({video}) => {
    const videoUrl = "https://www.youtube.com/embed/" + video.id;
    let videoDescription = video.snippet.description.split("\n");
    return (
        <div className="video-player">
            <iframe width="640" height="360" src={videoUrl}></iframe>
            <div className="video-details">
                <h3>{video.snippet.title}</h3>
                <hr/>
                <p>
                    {videoDescription.map(piece => {
                        return (
                            <span key={piece}>{piece}<br/></span>
                        );
                    })}
                </p>
            </div>
        </div>
    );
};

VideoPlayer.propTypes = {
    video: PropTypes.object.isRequired
};

export default VideoPlayer;