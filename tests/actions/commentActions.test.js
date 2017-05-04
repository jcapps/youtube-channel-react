import expect from 'expect';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import * as types from '../../src/actions/actionTypes';
import * as commentActions from '../../src/actions/commentActions';
import * as youtubeActions from '../../src/actions/youtubeActions';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Comment Actions', () => {
    describe('getCommentsSuccess', () => {
        it('Should create a GET_COMMENTS_SUCCESS action', () => {
            // arrange
            const comments = {};
            const expectedAction = {
                type: types.GET_COMMENTS_SUCCESS,
                comments: comments
            };

            // act
            const action = commentActions.getCommentsSuccess(comments);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getNextCommentsSuccess', () => {
        it('Should create a GET_NEXT_COMMENTS_SUCCESS action', () => {
            // arrange
            const comments = {};
            const expectedAction = {
                type: types.GET_NEXT_COMMENTS_SUCCESS,
                comments: comments
            };

            // act
            const action = commentActions.getNextCommentsSuccess(comments);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getRepliesSuccess', () => {
        it('Should create a GET_REPLIES_SUCCESS action', () => {
            // arrange
            const replies = {};
            const expectedAction = {
                type: types.GET_REPLIES_SUCCESS,
                replies: replies
            };

            // act
            const action = commentActions.getRepliesSuccess(replies);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getNextRepliesSuccess', () => {
        it('Should create a GET_NEXT_REPLIES_SUCCESS action', () => {
            // arrange
            const replies = {};
            const expectedAction = {
                type: types.GET_NEXT_REPLIES_SUCCESS,
                replies: replies
            };

            // act
            const action = commentActions.getNextRepliesSuccess(replies);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getComments', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_COMMENTS_SUCCESS actions when passed a videoId', (done) => {
            // arrange
            const comments= {};
            const expectedActions = {
                type: types.GET_COMMENTS_SUCCESS, 
                body: {comments: comments}
            };
            
            const store = mockStore({comments: comments}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getVideoComments');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(comments);
            }));

            // act
            store.dispatch(commentActions.getComments("ID")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_COMMENTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });

        it('Should dispatch BEGIN_AJAX_CALL and GET_COMMENTS_SUCCESS actions when passed a videoId and sortOrder', (done) => {
            // arrange
            const comments= {};
            const expectedActions = {
                type: types.GET_COMMENTS_SUCCESS, 
                body: {comments: comments}
            };
            
            const store = mockStore({comments: comments}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getVideoComments');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(comments);
            }));

            // act
            store.dispatch(commentActions.getComments("ID", "relevance")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_COMMENTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getNextComments', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_NEXT_COMMENTS_SUCCESS actions when passed a videoId, sortOrder, and pageToken', (done) => {
            // arrange
            const comments= {items: []};
            const expectedActions = {
                type: types.GET_NEXT_COMMENTS_SUCCESS, 
                body: {comments: comments}
            };
            
            const store = mockStore({comments: comments}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getVideoComments');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(comments);
            }));

            // act
            store.dispatch(commentActions.getNextComments("ID", "relevance", "TOKEN")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_NEXT_COMMENTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getReplies', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_REPLIES_SUCCESS actions when passed a commentId', (done) => {
            // arrange
            const replies= {};
            const expectedActions = {
                type: types.GET_REPLIES_SUCCESS, 
                body: {replies: replies}
            };
            
            const store = mockStore({replies: replies}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getCommentReplies');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(replies);
            }));

            // act
            store.dispatch(commentActions.getReplies("ID")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_REPLIES_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getNextReplies', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_NEXT_REPLIES_SUCCESS actions when passed a commentId, currentReplies, and pageToken', (done) => {
            // arrange
            const replies= {items: [{id: "1"}]};
            const expectedActions = {
                type: types.GET_NEXT_REPLIES_SUCCESS, 
                body: {replies: replies}
            };
            
            const store = mockStore({replies: replies}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getCommentReplies');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(replies);
            }));

            // act
            store.dispatch(commentActions.getNextReplies("ID", {items: [{id: "0"}]}, "TOKEN")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_NEXT_REPLIES_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });
});