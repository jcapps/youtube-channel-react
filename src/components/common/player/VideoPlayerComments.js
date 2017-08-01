import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commentActions from '../../../actions/commentActions';
import CommentThread from './CommentThread';

export class VideoPlayerComments extends React.Component {
    constructor() {
        super();
        this.state = {
            sortOrder: "relevance"
        };
        this.changeOrder = this.changeOrder.bind(this);
        this.loadMoreComments = this.loadMoreComments.bind(this);
    }

    componentWillMount() {
        this.props.actions.getComments(this.props.video.id);
    }

    componentWillUpdate(nextProps) {
        if (this.props.video.id != nextProps.video.id) {
            this.props.actions.getComments(nextProps.video.id).then(() => {
                this.setState({ sortOrder: "relevance" });
            });
        }
    }

    changeOrder(e) {
        const sortOrder = e.target.value;
        this.props.actions.getComments(this.props.video.id, sortOrder).then(() => {
            this.setState({ sortOrder: sortOrder });
        });
    }

    loadMoreComments() {
        const nextPageToken = this.props.comments.nextPageToken;
        const sortOrder = this.state.sortOrder;
        const id = this.props.video.id;
        this.props.actions.getNextComments(id, sortOrder, nextPageToken);
    }

    renderViewMore() {
        if (this.props.comments.nextPageToken) {
            return (
                <a id="view-more-comments" onClick={this.loadMoreComments}>
                    <div><b>View More</b></div>
                </a>
            );
        }
    }

    render() {
        const comments = this.props.comments.items;
        const stats = this.props.video.statistics;
        if (!comments || !stats) return <div>(Loading comments...)</div>;
        if (comments.length == 0) return <div className="comment-stats">Comments: 0</div>;
        return (
            <div>
                <div className="comment-header">
                    <div className="comment-stats">Comments: {this.props.video.statistics.commentCount}</div>
                    <select className="comment-sort" value={this.state.sortOrder} onChange={this.changeOrder}>
                        <option value="relevance">Relevance</option>
                        <option value="time">Most Recent</option>
                    </select>
                </div>
                <div className="comment-section">
                    {comments.map(thread => {
                        return (
                            <CommentThread
                                key={thread.id}
                                thread={thread}
                                videoId={this.props.video.id}
                                videoSeek={this.props.videoSeek} />
                        );
                    })}
                    {this.renderViewMore()}
                </div>
            </div>
        );
    }
}

VideoPlayerComments.propTypes = {
    comments: PropTypes.object.isRequired,
    video: PropTypes.object.isRequired,
    videoSeek: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { comments: state.comments };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(commentActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerComments);