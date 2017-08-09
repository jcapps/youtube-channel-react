import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as commentActions from '../../../actions/commentActions';
import CommentThread from './CommentThread';

export class VideoPlayerComments extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            sortOrder: "relevance",
            isLoading: true
        };
        this.changeOrder = this.changeOrder.bind(this);
        this.loadMoreComments = this.loadMoreComments.bind(this);
    }

    componentWillMount() {
        this.props.actions.getComments(this.props.video.id);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (!nextState.isLoading && this.props.comments !== nextProps.comments) || 
            (this.state.sortOrder !== nextState.sortOrder);
    }

    changeOrder(e) {
        const sortOrder = e.target.value;
        this.setState({ sortOrder: sortOrder });
        this.props.actions.getComments(this.props.video.id, sortOrder);
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
        if (this.state.isLoading) return <div>(Loading comments...)</div>;
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
    isLoading: PropTypes.bool.isRequired,
    comments: PropTypes.object.isRequired,
    video: PropTypes.object.isRequired,
    videoSeek: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        comments: state.comments,
        isLoading: state.ajaxCallsInProgress.comments > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(commentActions, dispatch) };
}

function mergeProps(state, actions, props) {
    let videoId = '';
    if (state.comments.items && state.comments.items.length > 0)
        videoId = state.comments.items[0].snippet.videoId;
    if ((videoId !== '' && props.video.id !== videoId)) {
        state.isLoading = true;
        actions.actions.getComments(props.video.id);
    }
    return Object.assign({}, state, actions, props);
}

// Compare comment arrays
// Return true if the two arrays contain the same comments in same order
function compareComments(prev, next) {
    if (prev.length != next.length) return false;
    for (let i = 0; i < prev.length; i++) {
        if (prev[i].id !== next[i].id) return false;
    }
    return true;
}

const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        let areCommentsEqual = false;
        if (!!prev.comments.items && !!next.comments.items) {
            // In case sorting by Relevance vs Most Recent doesn't actually change the order
            areCommentsEqual = compareComments(prev.comments.items, next.comments.items);
        }
        return !( // if the condition below is true, then return false to render
            (prev.isLoading && !next.isLoading) || 
            (!next.isLoading && !areCommentsEqual)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(VideoPlayerComments);