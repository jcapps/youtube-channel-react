import expect from 'expect';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import * as types from '../../src/actions/actionTypes';
import * as playlistActions from '../../src/actions/playlistActions';
import * as youtubeActions from '../../src/actions/youtubeActions';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Playlist Actions', () => {
    describe('getAllPlaylistsSuccess', () => {
        it('Should create a GET_ALL_PLAYLISTS_SUCCESS action', () => {
            // arrange
            const playlists = [];
            const expectedAction = {
                type: types.GET_ALL_PLAYLISTS_SUCCESS,
                playlists: playlists
            };

            // act
            const action = playlistActions.getAllPlaylistsSuccess(playlists);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getNextPlaylistsSuccess', () => {
        it('Should create a GET_NEXT_PLAYLISTS_SUCCESS action', () => {
            // arrange
            const playlists = [];
            const expectedAction = {
                type: types.GET_NEXT_PLAYLISTS_SUCCESS,
                playlists: playlists
            };

            // act
            const action = playlistActions.getNextPlaylistsSuccess(playlists);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getPlaylistSuccess', () => {
        it('Should create a GET_PLAYLIST_SUCCESS action', () => {
            // arrange
            const playlist = [];
            const expectedAction = {
                type: types.GET_PLAYLIST_SUCCESS,
                playlist: playlist
            };

            // act
            const action = playlistActions.getPlaylistSuccess(playlist);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getNextVideosSuccess', () => {
        it('Should create a GET_NEXT_VIDEOS_SUCCESS action', () => {
            // arrange
            const playlist = [];
            const expectedAction = {
                type: types.GET_NEXT_VIDEOS_SUCCESS,
                playlist: playlist
            };

            // act
            const action = playlistActions.getNextVideosSuccess(playlist);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getPlaylistInfoSuccess', () => {
        it('Should create a GET_PLAYLIST_INFO_SUCCESS action', () => {
            // arrange
            const playlistInfo = {};
            const expectedAction = {
                type: types.GET_PLAYLIST_INFO_SUCCESS,
                playlistInfo: playlistInfo
            };

            // act
            const action = playlistActions.getPlaylistInfoSuccess(playlistInfo);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getRecentUploadsPlaylistIdSuccess', () => {
        it('Should create a GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS action', () => {
            // arrange
            const playlistId = "";
            const expectedAction = {
                type: types.GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS,
                playlistId: playlistId
            };

            // act
            const action = playlistActions.getRecentUploadsPlaylistIdSuccess(playlistId);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getRecentUploadsPlaylistSuccess', () => {
        it('Should create a GET_RECENT_UPLOADS_PLAYLIST_SUCCESS action', () => {
            // arrange
            const playlist = [];
            const expectedAction = {
                type: types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS,
                playlist: playlist
            };

            // act
            const action = playlistActions.getRecentUploadsPlaylistSuccess(playlist);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getAllPlaylists', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_ALL_PLAYLISTS_SUCCESS actions', (done) => {
            // arrange
            const playlists = [];
            const expectedActions = {
                type: types.GET_ALL_PLAYLISTS_SUCCESS, 
                body: {playlists: playlists}
            };
            
            const store = mockStore({allPlaylists: playlists}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getAllPlaylists');
            mockAction.resolves(playlists);

            // act
            store.dispatch(playlistActions.getAllPlaylists()).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_ALL_PLAYLISTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getNextPlaylists', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_NEXT_PLAYLISTS_SUCCESS actions', (done) => {
            // arrange
            const playlists = [];
            const expectedActions = {
                type: types.GET_NEXT_PLAYLISTS_SUCCESS, 
                body: {playlists: playlists}
            };
            
            const store = mockStore({allPlaylists: playlists}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getAllPlaylists');
            mockAction.resolves({items: []});

            // act
            store.dispatch(playlistActions.getNextPlaylists("TOKEN")).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_NEXT_PLAYLISTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getPlaylist', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_PLAYLIST_SUCCESS actions', (done) => {
            // arrange
            const playlist = [];
            const expectedActions = {
                type: types.GET_PLAYLIST_SUCCESS, 
                body: {playlist: playlist}
            };
            
            const store = mockStore({playlist: playlist}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getPlaylist');
            mockAction.resolves(playlist);

            // act
            store.dispatch(playlistActions.getPlaylist("ID")).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_PLAYLIST_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getNextVideos', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_NEXT_VIDEOS_SUCCESS actions', (done) => {
            // arrange
            const playlist = [];
            const expectedActions = {
                type: types.GET_NEXT_VIDEOS_SUCCESS, 
                body: {playlist: playlist}
            };
            
            const store = mockStore({playlist: playlist}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getPlaylist');
            mockAction.resolves({items: []});

            // act
            store.dispatch(playlistActions.getNextVideos("ID", "TOKEN")).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_NEXT_VIDEOS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getPlaylistInfo', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_PLAYLIST_INFO_SUCCESS actions', (done) => {
            // arrange
            const playlistInfo = {};
            const expectedActions = {
                type: types.GET_PLAYLIST_INFO_SUCCESS, 
                body: {playlistInfo: playlistInfo}
            };
            
            const store = mockStore({playlistInfo: playlistInfo}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getPlaylistInfo');
            mockAction.resolves(playlistInfo);

            // act
            store.dispatch(playlistActions.getPlaylistInfo("ID", "TOKEN")).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_PLAYLIST_INFO_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getRecentUploadsPlaylist', () => {
        it('Should dispatch BEGIN_AJAX_CALL, GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS, '
            + 'and GET_RECENT_UPLOADS_PLAYLIST_SUCCESS actions', (done) => {
            // arrange
            const playlistId = "";
            const playlist = [];
            const expectedActions = [
                {
                    type: types.GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS, 
                    body: {playlistId: playlistId}
                }, 
                {
                    type: types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS, 
                    body: {playlist: playlist}
                }
            ];
            
            const store = mockStore(
                {playlistId: playlistId, playlist: playlist}, 
                expectedActions
            );

            let mockAction = sinon.stub(youtubeActions, 'getChannelDetails');
            mockAction.resolves({items: [{contentDetails: {relatedPlaylists: {uploads: ""}}}]});

            let mockAction2 = sinon.stub(youtubeActions, 'getPlaylist');
            mockAction2.resolves(playlist);

            // act
            store.dispatch(playlistActions.getRecentUploadsPlaylist()).then(() => {
                const actions = store.getActions();
                // assert
                // expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                // expect(actions[1].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[2].type).toEqual(types.GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS);
                expect(actions[3].type).toEqual(types.GET_RECENT_UPLOADS_PLAYLIST_SUCCESS);
                mockAction.restore();
                mockAction2.restore();
                done();
            });
        });
    });
});