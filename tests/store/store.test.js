import expect from 'expect';
import {createStore} from 'redux';
import rootReducer from '../../src/reducers';
import initialState from '../../src/reducers/initialState';
import * as channelActions from '../../src/actions/channelActions';
import * as playlistActions from '../../src/actions/playlistActions';
import * as videoActions from '../../src/actions/videoActions';

describe('Store', () => {
    const store = createStore(rootReducer, initialState);
    it('Should handle setting channelInfo', () => {
        // arrange
        const channelInfo = {
            items: [{ id: 'XXXXX' }]
        };

        // act
        const action = channelActions.getChannelInfoSuccess(channelInfo);
        store.dispatch(action);

        // assert
        const expected = { id: 'XXXXX' };
        const result = store.getState().channelInfo;
        expect(result).toEqual(expected);
    });

    it('Should handle setting allPlaylists', () => {
        // arrange
        const playlists = {
            items: [{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}]
        };

        // act
        const action = playlistActions.getAllPlaylistsSuccess(playlists);
        store.dispatch(action);

        // assert
        const expected = [{playlist: 'A'}, {playlist: 'B'}, {playlist: 'C'}];
        const result = store.getState().allPlaylists;
        expect(result).toEqual(expected);
    });

    it('Should handle setting mostRecentUpload', () => {
        // arrange
        const video = {
            items: [{id: 'XXXXX'}]
        };

        // act
        const action = videoActions.getMostRecentUploadSuccess(video);
        store.dispatch(action);

        // assert
        const expected = {id: 'XXXXX'};
        const result = store.getState().mostRecentUpload;
        expect(result).toEqual(expected);
    });

    it('Should handle setting playlistInfo', () => {
        // arrange
        const playlistInfo = {
            items: [{id: 'XXXXX'}]
        };

        // act
        const action = playlistActions.getPlaylistInfoSuccess(playlistInfo);
        store.dispatch(action);

        // assert
        const expected = {id: 'XXXXX'};
        const result = store.getState().playlistInfo;
        expect(result).toEqual(expected);
    });

    it('Should handle setting playlistPageToken', () => {
        // arrange
        const playlists = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY',
            items: []
        };

        // act
        const action = playlistActions.getAllPlaylistsSuccess(playlists);
        store.dispatch(action);

        // assert
        const expected = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const result = store.getState().playlistPageToken;
        expect(result).toEqual(expected);
    });

    it('Should handle setting playlist', () => {
        // arrange
        const playlist = {
            items: [{video: 'A'}, {video: 'B'}]
        };

        // act
        const action = playlistActions.getPlaylistSuccess(playlist);
        store.dispatch(action);

        // assert
        const expected = [{video: 'A'}, {video: 'B'}];
        const result = store.getState().playlist;
        expect(result).toEqual(expected);
    });

    it('Should handle setting recentUploadsPlaylistId', () => {
        // arrange
        const playlistId = 'XXXXX';

        // act
        const action = playlistActions.getRecentUploadsPlaylistIdSuccess(playlistId);
        store.dispatch(action);

        // assert
        const expected = 'XXXXX';
        const result = store.getState().recentUploadsPlaylistId;
        expect(result).toEqual(expected);
    });

    it('Should handle setting videoPageToken', () => {
        // arrange
        const playlist = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY',
            items: []
        };

        // act
        const action = playlistActions.getPlaylistSuccess(playlist);
        store.dispatch(action);

        // assert
        const expected = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const result = store.getState().videoPageToken;
        expect(result).toEqual(expected);
    });

    it('Should handle setting video', () => {
        // arrange
        const video = {
            items: [{id: 'XXXXX'}]
        };

        // act
        const action = videoActions.getVideoSuccess(video);
        store.dispatch(action);

        // assert
        const expected = {id: 'XXXXX'};
        const result = store.getState().video;
        expect(result).toEqual(expected);
    });

    it('Should handle setting searchResults', () => {
        // arrange
        const searchResults = {
            items: [{video: 'A'}, {playlist: 'B'}],
            pageInfo: {totalResults: 10}
        };

        // act
        const action = channelActions.getSearchResultsSuccess(searchResults);
        store.dispatch(action);

        // assert
        const expected = [{video: 'A'}, {playlist: 'B'}];
        const result = store.getState().searchResults;
        expect(result).toEqual(expected);
    });

    it('Should handle setting searchInfo', () => {
        // arrange
        const searchResults = {
            items: [{video: 'A'}, {playlist: 'B'}],
            pageInfo: {totalResults: 10}
        };

        // act
        const action = channelActions.getSearchResultsSuccess(searchResults);
        store.dispatch(action);

        // assert
        const expected = {totalResults: 10};
        const result = store.getState().searchInfo;
        expect(result).toEqual(expected);
    });

    it('Should handle setting searchPageToken', () => {
        // arrange
        const searchResults = {
            items: [{video: 'A'}, {playlist: 'B'}],
            pageInfo: {totalResults: 10},
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };

        // act
        const action = channelActions.getSearchResultsSuccess(searchResults);
        store.dispatch(action);

        // assert
        const expected = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const result = store.getState().searchPageToken;
        expect(result).toEqual(expected);
    });
});