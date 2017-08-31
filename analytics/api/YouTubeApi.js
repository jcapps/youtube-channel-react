import axios from 'axios';

const KEY = process.env.YOUTUBE_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

const apiUrl = 'https://www.googleapis.com/youtube/v3/';
const channelUrl = apiUrl + 'channels';
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

    static search(query, pageToken = "") {
        const searchParams = {
            key: KEY,
            channelId: CHANNEL_ID,
            maxResults: '25',
            part: 'snippet',
            q: query,
            type: 'playlist,video',
            pageToken: pageToken
        };

        return new Promise((resolve, reject) => {
            axios.get(searchUrl, {params: searchParams}).then(res => {
                resolve(res.data);
            });
        });
    }
}

export default YouTubeApi;