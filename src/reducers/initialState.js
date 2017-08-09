export default {
    channelInfo: {},
    mostRecentUpload: {},
    recentUploadsPlaylistId: "",
    allPlaylists: [],
    comments: {},
    playlistPageToken: {prevPageToken: "", nextPageToken: ""},
    playlist: [],
    playlistInfo: {},
    playlistIndex: 0,
    replies: {},
    searchResults: [],
    searchInfo: {totalResults: 0},
    searchPageToken: {prevPageToken: "", nextPageToken: ""},
    video: {current: {}, queued: {}},
    videoPageToken: {prevPageToken: "", nextPageToken: ""},
    ajaxCallsInProgress: {
        about: 0,
        allPlaylists: 0,
        allVideos: 0,
        comments: 0,
        header: 0,
        home: 0,
        playlist: 0,
        replies: 0,
        searchResults: 0,
        watch: 0
    }
};