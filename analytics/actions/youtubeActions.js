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
 * Search channel for playlists/videos given a search query and searchType
 */
export function searchChannel(query, searchType, pageToken = "") {
    return YouTubeApi.search(query, searchType, pageToken).then(result => {
        return result;
    }).catch(error => {
        throw(error);
    });
}