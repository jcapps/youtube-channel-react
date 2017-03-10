import expect from 'expect';
import sinon from 'sinon';
import * as types from '../../src/actions/actionTypes';
import * as youtubeActions from '../../src/actions/youtubeActions';
import YouTubeApi from '../../src/api/YouTubeApi';

describe('YouTube Actions', () => {
    describe('getChannelInfo', () => {
        it('Should return channelInfo', (done) => {
            // arrange
            const channelInfo = {};

            let mockAction = sinon.stub(YouTubeApi, 'getChannelInfo');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(channelInfo);
            }));

            // act
            youtubeActions.getChannelInfo().then(result => {
                // assert
                expect(result).toEqual(channelInfo);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getChannelDetails', () => {
        it('Should return channelDetails', (done) => {
            // arrange
            const channelDetails = {};

            let mockAction = sinon.stub(YouTubeApi, 'getChannelDetails');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(channelDetails);
            }));

            // act
            youtubeActions.getChannelDetails().then(result => {
                // assert
                expect(result).toEqual(channelDetails);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getAllPlaylists', () => {
        it('Should return playlists', (done) => {
            // arrange
            const playlists = [];

            let mockAction = sinon.stub(YouTubeApi, 'getAllPlaylists');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(playlists);
            }));

            // act
            youtubeActions.getAllPlaylists().then(result => {
                // assert
                expect(result).toEqual(playlists);
                mockAction.restore();
                done();
            });
        });

        it('Should return playlists when given a pageToken', (done) => {
            // arrange
            const playlists = [];

            let mockAction = sinon.stub(YouTubeApi, 'getAllPlaylists');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(playlists);
            }));

            // act
            youtubeActions.getAllPlaylists("TOKEN").then(result => {
                // assert
                expect(result).toEqual(playlists);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getPlaylist', () => {
        it('Should return a playlist when given a playlistId', (done) => {
            // arrange
            const playlist = [];

            let mockAction = sinon.stub(YouTubeApi, 'getPlaylist');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(playlist);
            }));

            // act
            youtubeActions.getPlaylist("ID").then(result => {
                // assert
                expect(result).toEqual(playlist);
                mockAction.restore();
                done();
            });
        });

        it('Should return a playlist when given a playlistId and a pageToken', (done) => {
            // arrange
            const playlist = [];

            let mockAction = sinon.stub(YouTubeApi, 'getPlaylist');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(playlist);
            }));

            // act
            youtubeActions.getPlaylist("ID", "TOKEN").then(result => {
                // assert
                expect(result).toEqual(playlist);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getPlaylistInfo', () => {
        it('Should return playlistInfo when given a playlistId', (done) => {
            // arrange
            const playlistInfo = {};

            let mockAction = sinon.stub(YouTubeApi, 'getPlaylistInfo');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(playlistInfo);
            }));

            // act
            youtubeActions.getPlaylistInfo("ID").then(result => {
                // assert
                expect(result).toEqual(playlistInfo);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getVideoInfo', () => {
        it('Should return a video when given a videoId', (done) => {
            // arrange
            const video = {};

            let mockAction = sinon.stub(YouTubeApi, 'getVideo');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve(video);
            }));

            // act
            youtubeActions.getVideoInfo("ID").then(result => {
                // assert
                expect(result).toEqual(video);
                mockAction.restore();
                done();
            });
        });
    });

    describe('subscribe', () => {
        it('Should call the API but not return a value', (done) => {
            // arrange
            let mockAction = sinon.stub(YouTubeApi, 'subscribe');
            mockAction.returns(new Promise((resolve, reject) => {
                resolve();
            }));

            // act, assert
            youtubeActions.subscribe().then(() => {
                mockAction.restore();
                done();
            });
        });
    });
});