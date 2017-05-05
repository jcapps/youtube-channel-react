import React, {PropTypes} from 'react';
const DOMPurify = require('dompurify')(window);

export class CommentBlock extends React.Component {
    constructor() {
        super();
        this.clickTimeStamp = this.clickTimeStamp.bind(this);
        this.minimizeComment = this.minimizeComment.bind(this);
        this.showFullComment = this.showFullComment.bind(this);

        this.state = {
            readMoreClick: this.showFullComment,
            readMoreText: "Read More"
        };
    }

    componentDidMount() {
        if (this.refs.text && this.refs.text.scrollHeight > 100) {
            this.refs.expand.classList.remove('hidden');
        }
    }

    minimizeComment(e) {
        const text = e.target.previousSibling;
        text.classList.add('comment-text');
        this.setState({
            readMoreClick: this.showFullComment,
            readMoreText: "Read More"
        });
    }
    
    showFullComment(e) {
        const text = e.target.previousSibling;
        text.classList.remove('comment-text');
        this.setState({
            readMoreClick: this.minimizeComment,
            readMoreText: "Show Less"
        });
    }

    getTimeElapsed(date) {
        let timeElapsed = "";
        const dateDiffSecs = Math.floor((Date.now() - date) / 1000);
        const dateDiffMins = Math.floor(dateDiffSecs / 60);
        const dateDiffHrs = Math.floor(dateDiffMins / 60);
        const dateDiffDays = Math.floor(dateDiffHrs / 24);
        const dateDiffWks = Math.floor(dateDiffDays / 7);
        const dateDiffMths = Math.floor(dateDiffDays / 30);
        const dateDiffYrs = Math.floor(dateDiffDays / 365);
        if (dateDiffSecs < 5) timeElapsed = "just now";
        if (dateDiffSecs >= 5 && dateDiffSecs < 60) timeElapsed = dateDiffSecs + " seconds ago";
        if (dateDiffMins == 1) timeElapsed = dateDiffMins + " minute ago";
        if (dateDiffMins > 1 && dateDiffMins < 60) timeElapsed = dateDiffMins + " minutes ago";
        if (dateDiffHrs == 1) timeElapsed = dateDiffHrs + " hour ago";
        if (dateDiffHrs > 1 && dateDiffHrs < 24) timeElapsed = dateDiffHrs + " hours ago";
        if (dateDiffDays == 1) timeElapsed = dateDiffDays + " day ago";
        if (dateDiffDays > 1 && dateDiffDays < 7) timeElapsed = dateDiffDays + " days ago";
        if (dateDiffWks == 1) timeElapsed = dateDiffWks + " week ago";
        if (dateDiffWks > 1 && dateDiffMths == 0) timeElapsed = dateDiffWks + " weeks ago";
        if (dateDiffMths == 1) timeElapsed = dateDiffMths + " month ago";
        if (dateDiffMths > 1 && dateDiffYrs == 0) timeElapsed = dateDiffMths + " months ago";
        if (dateDiffYrs == 1) timeElapsed = dateDiffYrs + " year ago";
        if (dateDiffYrs > 1) timeElapsed = dateDiffYrs + " years ago";
        return timeElapsed;
    }

    clickTimeStamp(e) {
        this.props.videoSeek(e.target.value);
    }

    renderComment() {
        const comment = this.props.comment.snippet;
        let cleanComment = DOMPurify.sanitize(comment.textDisplay); /* eslint-disable react/no-danger */

        // Handle video timestamp links in comments
        let timestamps;
        let times;
        let commentPieces = [];
        let timestampLinkLocation = cleanComment.indexOf('<a href="http://www.youtube.com/watch?v=' + this.props.videoId + '&amp;t=');

        if (timestampLinkLocation >= 0) {
            times = cleanComment.match(/(([0-9]+h)?([0-9]+m)?([0-9]+s))/g);
            timestamps = cleanComment.match(/(?:([01]?\d|2[0-3]):)?([0-5]?\d):([0-5]\d)/g);

            const regexTimeStampLink = new RegExp('<a href="http://www.youtube.com/watch\\?v=' + this.props.videoId + '&amp;t=');
            const regexTime = new RegExp(/(([0-9]+h)?([0-9]+m)?([0-9]+s))/);
            const regexCloseLink = new RegExp('">');
            const regexTimeStamp = new RegExp(/(?:([01]?\d|2[0-3]):)?([0-5]?\d):([0-5]\d)/);
            const regexCloseTag = new RegExp('</a>');
            const links = cleanComment.match(new RegExp(
                regexTimeStampLink.source
                + regexTime.source
                + regexCloseLink.source
                + regexTimeStamp.source
                + regexCloseTag.source, 'g')); // Find all occurrences of linked timestamps

            if (links.length == timestamps.length) { // Confirm: number of timestamps == number of linked timestamps
                for (let i = 0; i < links.length; i++) { // Remove linked timestamps from comment
                    let cleanComment1 = cleanComment.split(links[i])[0];
                    cleanComment = cleanComment.split(links[i])[1];
                    commentPieces = commentPieces.concat(cleanComment1);
                }
                commentPieces = commentPieces.concat(cleanComment);
            }
        }

        if (timestamps && timestamps.length > 0) { // If original comment contained timestamps
            return (
                <div ref="text" className="comment-text">
                    {timestamps.map((timestamp, i) => {
                        return ( // Add timestamps back in with a new link
                            <span key={i}>
                                <span dangerouslySetInnerHTML={{__html: commentPieces[i]}}></span>
                                <span><a value={times[i]} onClick={this.clickTimeStamp}>{timestamps[i]}</a></span>
                            </span>
                        );
                    })}
                    <span dangerouslySetInnerHTML={{__html: commentPieces[commentPieces.length - 1]}}></span>
                </div>
            );
        }

        return ( // If no linked timestamps in original comment
            <div ref="text" className="comment-text" dangerouslySetInnerHTML={{__html: cleanComment}}></div>
        );
    }

    renderLikes() {
        const comment = this.props.comment.snippet;
        let commentLikes = "";
        if (comment.likeCount > 0) {
            return (
                <div>
                    <span className="like-label">Likes: </span>
                    <span className="like-count">{comment.likeCount}</span>
                </div>
            );
        }
    }

    render() {
        const comment = this.props.comment.snippet;

        const commentUserName = comment.authorDisplayName;
        const commentUserUrl = comment.authorChannelUrl;
        const commentUserImage = comment.authorProfileImageUrl;
        const largerUserImage = commentUserImage.replace('s28', 's60');
        
        const commentDate = new Date(comment.updatedAt);
        const timeElapsed = this.getTimeElapsed(commentDate);

        return (
            <div className="comment">
                <a href={commentUserUrl} target="_blank">
                    <img src={largerUserImage} alt="Profile Image" className="comment-image" />
                </a>
                <div className="comment-info">
                    <div>
                        <a className="user-channel" href={commentUserUrl} target="_blank">
                            <div>{commentUserName}</div>
                        </a>
                        <div className="time-elapsed">{timeElapsed}</div>
                    </div>
                    {this.renderComment()}
                    <a ref="expand" className="hidden read-more" onClick={this.state.readMoreClick}>
                        {this.state.readMoreText}
                    </a>
                    {this.renderLikes()}
                </div>
            </div>
        );
    }
}

CommentBlock.propTypes = {
    comment: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    videoSeek: PropTypes.func.isRequired
};

export default CommentBlock;