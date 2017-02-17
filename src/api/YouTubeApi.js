import axios from 'axios';

const KEY = process.env.YOUTUBE_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

const apiUrl = 'https://www.googleapis.com/youtube/v3/';
const channelUrl = apiUrl + 'channels';
const playlistsUrl = apiUrl + 'playlists';
const playlistUrl = apiUrl + 'playlistItems';
const videoUrl = apiUrl + 'videos';

class YouTubeApi {
    static getChannelContent() {
        const channelParams = {
            key: KEY,
            id: CHANNEL_ID,
            part: 'contentDetails'
        };

        return new Promise((resolve, reject) => {
            axios.get(channelUrl, {params: channelParams}).then(res => {
                resolve(res.data.items[0]);
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
                resolve(res.data.items[0]);
            });
        });
    }

    static getAllPlaylists() {
        const playlistsParams = {
            key: KEY,
            channelId: CHANNEL_ID,
            part: 'snippet',
            maxResults: 5
        };

        return new Promise((resolve, reject) => {
            axios.get(playlistsUrl, {params: playlistsParams}).then(res => {
                resolve(res.data.items);
            });
        });
    }

    static getPlaylist(id) {
        const playlistParams = {
            key: KEY,
            playlistId: id,
            part: 'snippet',
            maxResults: 50
        };

        return new Promise((resolve, reject) => {
            axios.get(playlistUrl, {params: playlistParams}).then(res => {
                resolve(res.data.items);
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
                resolve(res.data.items[0]);
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
                resolve(res.data.items[0]);
            });
        });
    }
}

export default YouTubeApi;