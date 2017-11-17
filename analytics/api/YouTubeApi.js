import axios from 'axios';
import YouTubeAnalyticsApi from './YouTubeAnalyticsApi';

const KEY = process.env.YOUTUBE_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

const apiUrl = 'https://www.googleapis.com/youtube/v3/';
const channelUrl = apiUrl + 'channels';
const playlistsUrl = apiUrl + 'playlists';
const videoUrl = apiUrl + 'videos';
const searchUrl = apiUrl + 'search';

class YouTubeApi {
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

    static search(query, searchType, pageToken = "") {
        const authHeader = {
            'Authorization': 'Bearer ' + YouTubeAnalyticsApi.getAccessToken()
        };

        const searchParams = {
            channelId: CHANNEL_ID,
            order: 'viewCount',
            part: 'snippet',
            q: query,
            type: searchType,
            pageToken: pageToken
        };

        return new Promise((resolve, reject) => {
            axios.get(searchUrl, {headers: authHeader, params: searchParams}).then(res => {
                resolve(res.data);
            });
        });
    }
}

export default YouTubeApi;