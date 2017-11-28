import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export class VideoResult extends React.PureComponent {
    render() {
        const video = this.props.video;
        return (
            <Link to={"/watch/" + video.id}>
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
            </Link>
        );
    }
}

VideoResult.propTypes = {
    video: PropTypes.object.isRequired
};

export default VideoResult;