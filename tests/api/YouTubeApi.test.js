import expect from 'expect';
import moxios from 'moxios';
import YouTubeApi from '../../src/api/YouTubeApi';
import {YOUTUBE_INFO} from '../../tools/private/youtubeInfo';

describe('YouTube API', () => {
    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    describe('getChannelDetails', () => {
        it('Should make call to YouTube API and get channelDetails', (done) => {
            // arrange
            const expectedResult = {channelDetails: [{ id: 'XXXXX' }]};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/channels.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getChannelDetails().then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });

    describe('getChannelInfo', () => {
        it('Should make call to YouTube API and get channelInfo', (done) => {
            // arrange
            const expectedResult = {channelInfo: [{ id: 'XXXXX' }]};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/channels.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getChannelInfo().then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });

    describe('getAllPlaylists', () => {
        it('Should make call to YouTube API and get allPlaylists', (done) => {
            // arrange
            const expectedResult = {playlists: [{ id: 'XXXXX' }]};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/playlists.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getAllPlaylists().then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });

        it('Should make call to YouTube API and get allPlaylists when passed a pageToken', (done) => {
            // arrange
            const expectedResult = {playlists: [{ id: 'XXXXX' }]};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/playlists.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getAllPlaylists("TOKEN").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });

    describe('getPlaylist', () => {
        it('Should make call to YouTube API and get playlist when passed a playlistId', (done) => {
            // arrange
            const expectedResult = {playlist: [{ id: 'XXXXX' }]};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/playlistItems.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getPlaylist("ID").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });

        it('Should make call to YouTube API and get playlist when passed a playlistId and a pageToken', (done) => {
            // arrange
            const expectedResult = {playlist: [{ id: 'XXXXX' }]};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/playlistItems.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getPlaylist("ID", "TOKEN").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });

    describe('getPlaylistInfo', () => {
        it('Should make call to YouTube API and get playlistInfo when passed a playlistId', (done) => {
            // arrange
            const expectedResult = {playlistInfo: { id: 'XXXXX' }};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/playlists.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getPlaylistInfo("ID").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });

    describe('getVideo', () => {
        it('Should make call to YouTube API and get video when passed a videoId', (done) => {
            // arrange
            const expectedResult = {video: { id: 'XXXXX' }};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/videos.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.getVideo("ID").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });

    describe('search', () => {
        it('Should make call to YouTube API and get results when passed a search query', (done) => {
            // arrange
            const expectedResult = {items: []};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/search.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.search("QUERY").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });

        it('Should make call to YouTube API and get results when passed a search query and a pageToken', (done) => {
            // arrange
            const expectedResult = {items: []};

            moxios.stubRequest(/https:\/\/www.googleapis.com\/youtube\/v3\/search.*/, {
                status: 200,
                response: expectedResult
            });

            // act
            YouTubeApi.search("QUERY", "TOKEN").then(result => {
                // assert
                expect(result).toEqual(expectedResult);
                done();
            });
        });
    });
});