import React from 'react';
import PropTypes from 'prop-types';

class VideoPlayerDescription extends React.Component {
    constructor() {
        super();
        this.renderTitle = this.renderTitle.bind(this);
    }

    renderTitle(title) {
        let subTitleArray = new Array();
        let subTitleIndex = 1;
        while (subTitleIndex < title.length) {
            if (title[subTitleIndex] !== '') {
                subTitleArray.push(title[subTitleIndex].trim());
            }
            subTitleIndex++;
        }

        return (
            <div>
                <h3>{title[0].trim()}</h3>
                {subTitleArray.map((subTitle, i) => <h4 key={i}>{subTitle}</h4>)}
            </div>
        );
    }
    
    render() {
        const video = this.props.video;
        let description = video.snippet.description.split("\n");
        let title = video.snippet.title.split(/\|(.+)/);
        let date = new Date(video.snippet.publishedAt);
        date = date.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });

        return (
            <div className="video-details">
                {this.renderTitle(title)}
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
    }
}

VideoPlayerDescription.propTypes = {
    video: PropTypes.object.isRequired
};

export default VideoPlayerDescription;