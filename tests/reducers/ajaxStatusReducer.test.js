import expect from 'expect';
import ajaxStatusReducer from '../../src/reducers/ajaxStatusReducer';
import * as ajaxStatusActions from '../../src/actions/ajaxStatusActions';
import * as channelActions from '../../src/actions/channelActions';
import * as commentActions from '../../src/actions/commentActions';
import * as playlistActions from '../../src/actions/playlistActions';
import * as videoActions from '../../src/actions/videoActions';

describe('Ajax Status Reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };
    });

    it('Should increase about, channel, and header ajaxCallsInProgress when passed GETTING_CHANNEL_INFO', () => {
        // arrange
        const action = ajaxStatusActions.gettingChannelInfo();
        const expectedState = {
            about: 1,
            allPlaylists: 0,
            allVideos: 0,
            channel: 1,
            comments: 0,
            header: 1,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease about, channel, and header ajaxCallsInProgress when passed GET_CHANNEL_INFO_SUCCESS', () => {
        // arrange
        const action = channelActions.getChannelInfoSuccess({});
        const expectedState = {
            about: -1,
            allPlaylists: 0,
            allVideos: 0,
            channel: -1,
            comments: 0,
            header: -1,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase allPlaylists and header ajaxCallsInProgress when passed GETTING_ALL_PLAYLISTS', () => {
        // arrange
        const action = ajaxStatusActions.gettingAllPlaylists();
        const expectedState = {
            about: 0,
            allPlaylists: 1,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 1,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease allPlaylists and header ajaxCallsInProgress when passed GET_ALL_PLAYLISTS_SUCCESS', () => {
        // arrange
        const action = playlistActions.getAllPlaylistsSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: -1,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: -1,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease allPlaylists and header ajaxCallsInProgress when passed GET_NEXT_PLAYLISTS_SUCCESS', () => {
        // arrange
        const action = playlistActions.getNextPlaylistsSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: -1,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: -1,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase allVideos and home ajaxCallsInProgress when passed GETTING_RECENT_UPLOADS_PLAYLIST_ID', () => {
        // arrange
        const action = ajaxStatusActions.gettingRecentUploadsPlaylistId();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 1,
            channel: 0,
            comments: 0,
            header: 0,
            home: 1,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase allVideos and home ajaxCallsInProgress when passed GETTING_RECENT_UPLOADS_PLAYLIST', () => {
        // arrange
        const action = ajaxStatusActions.gettingRecentUploadsPlaylist();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 1,
            channel: 0,
            comments: 0,
            header: 0,
            home: 1,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase allVideos and playlist ajaxCallsInProgress when passed GETTING_PLAYLIST', () => {
        // arrange
        const action = ajaxStatusActions.gettingPlaylist();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 1,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 1,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease allVideos and home ajaxCallsInProgress when passed GET_RECENT_UPLOADS_PLAYLIST_ID_SUCCESS', () => {
        // arrange
        const action = playlistActions.getRecentUploadsPlaylistIdSuccess('');
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: -1,
            channel: 0,
            comments: 0,
            header: 0,
            home: -1,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease allVideos and home ajaxCallsInProgress when passed GET_RECENT_UPLOADS_PLAYLIST_SUCCESS', () => {
        // arrange
        const action = playlistActions.getRecentUploadsPlaylistSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: -1,
            channel: 0,
            comments: 0,
            header: 0,
            home: -1,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease allVideos and playlist ajaxCallsInProgress when passed GET_PLAYLIST_SUCCESS', () => {
        // arrange
        const action = playlistActions.getPlaylistSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: -1,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: -1,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease allVideos and playlist ajaxCallsInProgress when passed GET_NEXT_VIDEOS_SUCCESS', () => {
        // arrange
        const action = playlistActions.getNextVideosSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: -1,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: -1,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase comments ajaxCallsInProgress when passed GETTING_VIDEO_COMMENTS', () => {
        // arrange
        const action = ajaxStatusActions.gettingVideoComments();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 1,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease comments ajaxCallsInProgress when passed GET_COMMENTS_SUCCESS', () => {
        // arrange
        const action = commentActions.getCommentsSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: -1,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease comments ajaxCallsInProgress when passed GET_NEXT_COMMENTS_SUCCESS', () => {
        // arrange
        const action = commentActions.getNextCommentsSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: -1,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase home ajaxCallsInProgress when passed GETTING_MOST_RECENT_UPLOAD', () => {
        // arrange
        const action = ajaxStatusActions.gettingMostRecentUpload();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 1,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease home ajaxCallsInProgress when passed GET_MOST_RECENT_UPLOAD_SUCCESS', () => {
        // arrange
        const action = videoActions.getMostRecentUploadSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: -1,
            playlist: 0,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase playlist ajaxCallsInProgress when passed GETTING_PLAYLIST_INFO', () => {
        // arrange
        const action = ajaxStatusActions.gettingPlaylistInfo();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 1,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease playlist ajaxCallsInProgress when passed GET_PLAYLIST_INFO_SUCCESS', () => {
        // arrange
        const action = playlistActions.getPlaylistInfoSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: -1,
            replies: 0,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase replies ajaxCallsInProgress when passed GETTING_COMMENT_REPLIES', () => {
        // arrange
        const action = ajaxStatusActions.gettingCommentReplies();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 1,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease replies ajaxCallsInProgress when passed GET_REPLIES_SUCCESS', () => {
        // arrange
        const action = commentActions.getRepliesSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: -1,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease replies ajaxCallsInProgress when passed GET_NEXT_REPLIES_SUCCESS', () => {
        // arrange
        const action = commentActions.getNextRepliesSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: -1,
            searchResults: 0,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase searchResults ajaxCallsInProgress when passed SEARCHING_CHANNEL', () => {
        // arrange
        const action = ajaxStatusActions.searchingChannel();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 1,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should increase searchResults and watch ajaxCallsInProgress when passed GETTING_VIDEO_INFO', () => {
        // arrange
        const action = ajaxStatusActions.gettingVideoInfo();
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: 1,
            watch: 1
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease searchResults ajaxCallsInProgress when passed GET_SEARCH_RESULTS_SUCCESS', () => {
        // arrange
        const action = channelActions.getSearchResultsSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: -1,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease searchResults ajaxCallsInProgress when passed GET_NEXT_RESULTS_SUCCESS', () => {
        // arrange
        const action = channelActions.getNextResultsSuccess([]);
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: -1,
            watch: 0
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should decrease searchResults and watch ajaxCallsInProgress when passed GET_VIDEO_SUCCESS', () => {
        // arrange
        const action = videoActions.getVideoSuccess({});
        const expectedState = {
            about: 0,
            allPlaylists: 0,
            allVideos: 0,
            channel: 0,
            comments: 0,
            header: 0,
            home: 0,
            playlist: 0,
            replies: 0,
            searchResults: -1,
            watch: -1
        };

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(expectedState);
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const action = {type: 'DUMMY_ACTION_FAIL'};

        // act
        const newState = ajaxStatusReducer(initialState, action);

        // assert
        expect(newState).toEqual(initialState);
    });
});