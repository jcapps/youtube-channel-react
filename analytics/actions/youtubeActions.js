import YouTubeApi from '../api/YouTubeApi';

/**
 * Retrieve information about the YouTube channel
 * (Contains channel name, description, profile image)
 */
export function getChannelInfo() {
    return YouTubeApi.getChannelInfo().then(channelInfo => {
        return channelInfo;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Search channel for playlists/videos given a search query
 */
export function searchChannel(query, pageToken = "") {
    return YouTubeApi.search(query, pageToken).then(result => {
        return result;
    }).catch(error => {
        throw(error);
    });
}