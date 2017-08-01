import React from 'react';
import PropTypes from 'prop-types';

const VideoPlayerDescription = ({video}) => {
    let description = video.snippet.description.split("\n");
    let title = video.snippet.title.split(/\|(.+)/);
    let date = new Date(video.snippet.publishedAt);
    date = date.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="video-details">
            <h3>{title[0].trim()}</h3>
            <h4>{title[1].trim()}</h4>
            <hr/>
            <p className="video-description">
                {description.map(piece => {
                    return (
                        <span key={piece}>{piece}<br/></span>
                    );
                })}
            </p>
            <p className="date-published">Published: {date}</p>
        </div>
    );
};

VideoPlayerDescription.propTypes = {
    video: PropTypes.object.isRequired
};

export default VideoPlayerDescription;