import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commentActions from '../../../actions/commentActions';
import CommentBlock from './CommentBlock';

export class CommentThread extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canHideReplies: false
        };
        this.loadMoreReplies = this.loadMoreReplies.bind(this);
        this.hideReplies = this.hideReplies.bind(this);
    }

    componentWillMount() {
        const numReplies = this.props.thread.snippet.totalReplyCount;
        if (numReplies > 0) {
            const parentCommentId = this.props.thread.snippet.topLevelComment.id;
            this.props.actions.getReplies(parentCommentId);
        }
    }

    loadMoreReplies() {
        const nextPageToken = this.props.replies.nextPageToken;
        const parentCommentId = this.props.thread.snippet.topLevelComment.id;
        this.props.actions.getNextReplies(parentCommentId, this.props.replies, nextPageToken).then(() => {
            this.setState({ canHideReplies: true });
        });
    }

    hideReplies() {
        const parentCommentId = this.props.thread.snippet.topLevelComment.id;
        this.props.actions.getReplies(parentCommentId).then(() => {
            this.setState({ canHideReplies: false });
        });
    }

    renderViewMoreReplies() {
        const replyCount = this.props.thread.snippet.totalReplyCount;
        const nextPageToken = this.props.replies.nextPageToken;
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
        if (numReplies > 0 && this.props.replies.items) {
            replies = Object.assign([], this.props.replies.items).reverse();
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

function mergeProps(state, actions, props) {
    return Object.assign({}, state, actions, props);
}

const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        if (!next.replies.items) return true;
        // Only want to render when these two values are the same. (Returning false causes a re-render.)
        return (next.thread.id !== next.replies.items[0].snippet.parentId);
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(CommentThread);