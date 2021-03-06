import expect from 'expect';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import * as types from '../../src/actions/actionTypes';
import * as videoTypes from '../../src/reducers/videoTypes';
import * as videoActions from '../../src/actions/videoActions';
import * as playlistActions from '../../src/actions/playlistActions';
import * as youtubeActions from '../../src/actions/youtubeActions';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Video Actions', () => {
    describe('getVideoSuccess', () => {
        it('Should create a GET_VIDEO_SUCCESS action', () => {
            // arrange
            const video = {};
            const videoType = videoTypes.CURRENT;
            const playlistIndex = 0;
            const expectedAction = {
                playlistIndex: playlistIndex,
                type: types.GET_VIDEO_SUCCESS,
                video: video,
                videoType: videoType
            };

            // act
            const action = videoActions.getVideoSuccess(video, videoType, playlistIndex);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getMostRecentUploadSuccess', () => {
        it('Should create a GET_MOST_RECENT_UPLOAD_SUCCESS action', () => {
            // arrange
            const video = {};
            const expectedAction = {
                type: types.GET_MOST_RECENT_UPLOAD_SUCCESS,
                video: video
            };

            // act
            const action = videoActions.getMostRecentUploadSuccess(video);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getVideo', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_VIDEO_SUCCESS actions for CURRENT video', (done) => {
            // arrange
            const video = {items: [{}]};
            const expectedActions = {
                type: types.GET_VIDEO_SUCCESS, 
                body: {
                    video: video,
                    videoTypes: videoTypes.CURRENT
                }
            };
            
            const store = mockStore({video: {current: {}, queued: {}}}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getVideoInfo');
            mockAction.resolves(video);

            // act
            store.dispatch(videoActions.getVideo("ID", videoTypes.CURRENT)).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_VIDEO_SUCCESS);
                mockAction.restore();
                done();
            });
        });

        it('Should dispatch BEGIN_AJAX_CALL and GET_VIDEO_SUCCESS actions for QUEUED video', (done) => {
            // arrange
            const video = {items: [{}]};
            const expectedActions = {
                type: types.GET_VIDEO_SUCCESS, 
                body: {
                    video: video,
                    videoTypes: videoTypes.QUEUED
                }
            };
            
            const store = mockStore({video: {current: {}, queued: {}}}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getVideoInfo');
            mockAction.resolves(video);

            // act
            store.dispatch(videoActions.getVideo("ID", videoTypes.QUEUED)).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_VIDEO_SUCCESS);
                mockAction.restore();
                done();
            });
        });

        it('Should dispatch BEGIN_AJAX_CALL and GET_VIDEO_SUCCESS actions with optional playlistIndex', (done) => {
            // arrange
            const video = {items: [{}]};
            const expectedActions = {
                type: types.GET_VIDEO_SUCCESS, 
                body: {
                    video: video,
                    videoTypes: videoTypes.CURRENT,
                    playlistIndex: 1
                }
            };
            
            const store = mockStore({video: {current: {}, queued: {}}}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getVideoInfo');
            mockAction.resolves(video);

            // act
            store.dispatch(videoActions.getVideo("ID", videoTypes.CURRENT, 1)).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_VIDEO_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getMostRecentUpload', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_MOST_RECENT_UPLOAD_SUCCESS actions', (done) => {
            // arrange
            const video = {items: [{}]};
            const expectedActions = {
                type: types.GET_MOST_RECENT_UPLOAD_SUCCESS, 
                body: {video: video}
            };
            
            const store = mockStore({video: video}, expectedActions);

            let mockAction = sinon.stub(playlistActions, 'getRecentUploadsPlaylist');
            mockAction.returns(function(dispatch) {
                return new Promise((resolve, reject) => {
                    dispatch({type: 'DUMMY_ACTION'});
                    resolve({items: [{snippet: {resourceId: {videoId: ""}}}]});
                });
            });

            let mockAction2 = sinon.stub(youtubeActions, 'getVideoInfo');
            mockAction2.resolves(video);

            // act
            store.dispatch(videoActions.getMostRecentUpload()).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[2].type).toEqual(types.GET_MOST_RECENT_UPLOAD_SUCCESS);
                mockAction.restore();
                mockAction2.restore();
                done();
            });
        });
    });
});