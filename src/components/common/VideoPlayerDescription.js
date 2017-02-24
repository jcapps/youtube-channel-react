import React, {PropTypes} from 'react';

const VideoPlayerDescription = ({video}) => {
    let description = video.snippet.description.split("\n");
    let title = video.snippet.title.split(/\|(.+)/);

    return (
        <div className="video-details">
            <h3>{title[0].trim()}</h3>
            <h4>{title[1].trim()}</h4>
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
    video: PropTypes.object.isRequired
};

export default VideoPlayerDescription;