import axios from 'axios';

const KEY = process.env.YOUTUBE_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

const apiUrl = 'https://www.googleapis.com/youtube/v3/';
const channelUrl = apiUrl + 'channels';
const playlistUrl = apiUrl + 'playlistItems';
const videoUrl = apiUrl + 'videos';

class YouTubeApi {
    static getChannelInfo() {
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

    static getPlaylist(id) {
        const playlistParams = {
            key: KEY,
            playlistId: id,
            part: 'snippet'
        };

        return new Promise((resolve, reject) => {
            axios.get(playlistUrl, {params: playlistParams}).then(res => {
                resolve(res.data.items);
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