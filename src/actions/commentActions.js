import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getCommentsSuccess(comments) {
    return { type: types.GET_COMMENTS_SUCCESS, comments };
}

export function getNextCommentsSuccess(comments) {
    return { type: types.GET_NEXT_COMMENTS_SUCCESS, comments };
}

export function getRepliesSuccess(replies) {
    return { type: types.GET_REPLIES_SUCCESS, replies };
}

export function getNextRepliesSuccess(replies) {
    return { type: types.GET_NEXT_REPLIES_SUCCESS, replies };
}

export function getComments(videoId, sortOrder = "relevance") {
    return function(dispatch) {
        dispatch(ajax.gettingVideoComments());
        return youtubeActions.getVideoComments(videoId, sortOrder).then(comments => {
            dispatch(getCommentsSuccess(comments));
        });
    };
}

export function getNextComments(videoId, sortOrder, pageToken) {
    return function(dispatch, getState) {
        dispatch(ajax.gettingVideoComments());
        return youtubeActions.getVideoComments(videoId, sortOrder, pageToken).then(comments => {
            const state = getState();
            const commentItems = [...state.comments.items, ...comments.items];
            comments.items = commentItems;
            dispatch(getNextCommentsSuccess(comments));
        });
    };
}

export function getReplies(commentId) {
    return function(dispatch) {
        dispatch(ajax.gettingCommentReplies());
        return youtubeActions.getCommentReplies(commentId, 2).then(replies => {
            dispatch(getRepliesSuccess(replies));
        });
    };
}

export function getNextReplies(commentId, currentReplies, pageToken) {
    return function(dispatch) {
        dispatch(ajax.gettingCommentReplies());
        return youtubeActions.getCommentReplies(commentId, 10, pageToken).then(replies => {
            let oldReplies = Object.assign([], currentReplies.items);
            if (oldReplies[oldReplies.length - 1].id == replies.items[0].id) {
                oldReplies.pop(); // API sometimes returns a duplicate of the previous array.
            }
            const replyItems = [...oldReplies, ...replies.items];
            replies.items = replyItems;
            dispatch(getNextRepliesSuccess(replies));
        });
    };
}