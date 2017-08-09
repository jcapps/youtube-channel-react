import expect from 'expect';
import * as types from '../../src/actions/actionTypes';
import * as ajaxStatusActions from '../../src/actions/ajaxStatusActions';

describe('Ajax Status Actions', () => {
    describe('gettingChannelInfo', () => {
        it('Should create a GETTING_CHANNEL_INFO action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_CHANNEL_INFO};

            // act
            const action = ajaxStatusActions.gettingChannelInfo();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('searchingChannel', () => {
        it('Should create a SEARCHING_CHANNEL action', () => {
            // arrange
            const expectedAction = {type: types.SEARCHING_CHANNEL};

            // act
            const action = ajaxStatusActions.searchingChannel();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingVideoComments', () => {
        it('Should create a GETTING_VIDEO_COMMENTS action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_VIDEO_COMMENTS};

            // act
            const action = ajaxStatusActions.gettingVideoComments();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingCommentReplies', () => {
        it('Should create a GETTING_COMMENT_REPLIES action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_COMMENT_REPLIES};

            // act
            const action = ajaxStatusActions.gettingCommentReplies();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingAllPlaylists', () => {
        it('Should create a GETTING_ALL_PLAYLISTS action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_ALL_PLAYLISTS};

            // act
            const action = ajaxStatusActions.gettingAllPlaylists();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingPlaylist', () => {
        it('Should create a GETTING_PLAYLIST action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_PLAYLIST};

            // act
            const action = ajaxStatusActions.gettingPlaylist();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingPlaylistInfo', () => {
        it('Should create a GETTING_PLAYLIST_INFO action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_PLAYLIST_INFO};

            // act
            const action = ajaxStatusActions.gettingPlaylistInfo();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingRecentUploadsPlaylist', () => {
        it('Should create a GETTING_RECENT_UPLOADS_PLAYLIST action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_RECENT_UPLOADS_PLAYLIST};

            // act
            const action = ajaxStatusActions.gettingRecentUploadsPlaylist();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingRecentUploadsPlaylistId', () => {
        it('Should create a GETTING_RECENT_UPLOADS_PLAYLIST_ID action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_RECENT_UPLOADS_PLAYLIST_ID};

            // act
            const action = ajaxStatusActions.gettingRecentUploadsPlaylistId();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingVideoInfo', () => {
        it('Should create a GETTING_VIDEO_INFO action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_VIDEO_INFO};

            // act
            const action = ajaxStatusActions.gettingVideoInfo();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('gettingMostRecentUpload', () => {
        it('Should create a GETTING_MOST_RECENT_UPLOAD action', () => {
            // arrange
            const expectedAction = {type: types.GETTING_MOST_RECENT_UPLOAD};

            // act
            const action = ajaxStatusActions.gettingMostRecentUpload();

            // assert
            expect(action).toEqual(expectedAction);
        });
    });
});