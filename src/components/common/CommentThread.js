import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commentActions from '../../actions/commentActions';
import CommentBlock from './CommentBlock';

export class CommentThread extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            replies: Object.assign({}, props.replies),
            canHideReplies: false
        };
        this.loadMoreReplies = this.loadMoreReplies.bind(this);
        this.hideReplies = this.hideReplies.bind(this);
    }

    componentWillMount() {
        const numReplies = this.props.thread.snippet.totalReplyCount;
        if (numReplies > 0) {
            const parentCommentId = this.props.thread.snippet.topLevelComment.id;
            this.props.actions.getReplies(parentCommentId).then(() => {
                this.setState({ 
                    replies: Object.assign({}, this.props.replies)
                });
            });
        }
    }

    loadMoreReplies() {
        const nextPageToken = this.state.replies.nextPageToken;
        const parentCommentId = this.props.thread.snippet.topLevelComment.id;
        this.props.actions.getNextReplies(parentCommentId, this.state.replies, nextPageToken).then(() => {
            this.setState({
                replies: Object.assign({}, this.props.replies),
                canHideReplies: true
            });
        });
    }

    hideReplies() {
        const parentCommentId = this.props.thread.snippet.topLevelComment.id;
        this.props.actions.getReplies(parentCommentId).then(() => {
            this.setState({ 
                replies: Object.assign({}, this.props.replies),
                canHideReplies: false
            });
        });
    }

    renderViewMoreReplies() {
        const replyCount = this.props.thread.snippet.totalReplyCount;
        const nextPageToken = this.state.replies.nextPageToken;
        if (replyCount > 0 && nextPageToken) {
            return (
                <a className="view-more-replies" onClick={this.loadMoreReplies}>
                    <div><b>View More Replies</b></div>
                </a>
            );
        }
    }

    renderHideReplies() {
        if (this.state.canHideReplies) {
            return (
                <a className="hide-replies" onClick={this.hideReplies}>
                    <div><b>Hide Replies</b></div>
                </a>
            );
        }
    }

    render() {
        const comment = this.props.thread.snippet.topLevelComment;
        const numReplies = this.props.thread.snippet.totalReplyCount;
        let replies = [];
        if (numReplies > 0 && this.state.replies.items) {
            replies = Object.assign([], this.state.replies.items).reverse();
        }

        return (
            <div className="comment-thread">
                <CommentBlock
                    comment={comment}
                    videoId={this.props.videoId}
                    videoSeek={this.props.videoSeek} />
                <div className="replies">
                    <div className="view-hide-replies">
                        {this.renderViewMoreReplies()}
                        {this.renderHideReplies()}
                    </div>
                    {replies.map(reply => {
                        return (
                            <div key={reply.id}>
                                <hr/>
                                <CommentBlock
                                    comment={reply}
                                    videoId={this.props.videoId}
                                    videoSeek={this.props.videoSeek} />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

CommentThread.propTypes = {
    thread: PropTypes.object.isRequired,
    replies: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    videoSeek: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { replies: state.replies };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(commentActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentThread);