import axios from 'axios';
import toastr from 'toastr';

const CLIENT_ID = process.env.CLIENT_ID;
const KEY = process.env.YOUTUBE_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

const googleClientApiUrl = 'https://apis.google.com/js/api.js';
const apiUrl = 'https://www.googleapis.com/youtube/v3/';
const channelUrl = apiUrl + 'channels';
const playlistsUrl = apiUrl + 'playlists';
const playlistUrl = apiUrl + 'playlistItems';
const videoUrl = apiUrl + 'videos';
const subscribeScope = 'https://www.googleapis.com/auth/youtube';
const subscribeDiscoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

class YouTubeApi {
    static getChannelDetails() {
        const channelParams = {
            key: KEY,
            id: CHANNEL_ID,
            part: 'contentDetails'
        };

        return new Promise((resolve, reject) => {
            axios.get(channelUrl, {params: channelParams}).then(res => {
                resolve(res.data);
            });
        });
    }

    static getChannelInfo() {
        const channelParams = {
            key: KEY,
            id: CHANNEL_ID,
            part: 'snippet'
        };

        return new Promise((resolve, reject) => {
            axios.get(channelUrl, {params: channelParams}).then(res => {
                resolve(res.data);
            });
        });
    }

    static getAllPlaylists(pageToken = "") {
        const playlistsParams = {
            key: KEY,
            channelId: CHANNEL_ID,
            part: 'snippet',
            maxResults: 5,
            pageToken: pageToken
        };

        return new Promise((resolve, reject) => {
            axios.get(playlistsUrl, {params: playlistsParams}).then(res => {
                resolve(res.data);
            });
        });
    }

    static getPlaylist(id, pageToken = "") {
        const playlistParams = {
            key: KEY,
            playlistId: id,
            part: 'snippet',
            maxResults: 25,
            pageToken: pageToken
        };

        return new Promise((resolve, reject) => {
            axios.get(playlistUrl, {params: playlistParams}).then(res => {
                resolve(res.data);
            });
        });
    }

    static getPlaylistInfo(id) {
        const playlistParams = {
            key: KEY,
            id: id,
            part: 'snippet'
        };

        return new Promise((resolve, reject) => {
            axios.get(playlistsUrl, {params: playlistParams}).then(res => {
                resolve(res.data);
            });
        });
    }

    static getVideo(id) {
        const videoParams = {
            key: KEY,
            id: id,
            part: 'snippet'
        };

        return new Promise((resolve, reject) => {
            axios.get(videoUrl, {params: videoParams}).then(res => {
                resolve(res.data);
            });
        });
    }

    static subscribe() {
        const subscribeParams = {
            'part': 'id, snippet',
            'snippet': {
                'resourceId': {
                    'kind': 'youtube#channel',
                    'channelId': CHANNEL_ID
                }
            }
        };

        return new Promise((resolve, reject) => {
            let GoogleAuth;
            let gapiScript = document.createElement('script');
            gapiScript.id = 'gapiScript';
            gapiScript.src = googleClientApiUrl;
            gapiScript.onload = () => {
                /* eslint-disable no-undef */
                gapi.load('client:auth2', () => {
                    gapi.client.init({
                        'apiKey': KEY,
                        'clientId': CLIENT_ID,
                        'scope': subscribeScope,
                        'discoveryDocs': subscribeDiscoveryDocs
                    }).then(() => {
                        GoogleAuth = gapi.auth2.getAuthInstance();
                        GoogleAuth.signIn().then(() => {
                            if (GoogleAuth.isSignedIn.get()) {
                                let request = gapi.client.youtube.subscriptions.insert(subscribeParams);
                                request.execute(res => {
                                    toastr.options = { positionClass: "toastr-center" };
                                    if (res.result) {
                                        toastr.success("Subscribed!");
                                    } else {
                                        toastr.error(res.error.message);
                                    }
                                });
                            } else {
                                toastr.error("Unable to sign in.");
                            }
                            let scriptToRemove = document.getElementById('gapiScript');
                            scriptToRemove.parentNode.removeChild(scriptToRemove);
                            resolve();
                        });
                    });
                });
            };
            document.getElementsByTagName('head')[0].appendChild(gapiScript);
        });
    }
}

export default YouTubeApi;