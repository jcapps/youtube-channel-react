import DataTypes from './DataTypes';

const Metrics = {
    AD_REVENUE: {
        name: 'adRevenue',
        metric: 'estimatedAdRevenue',
        displayName: 'Estimated Ad Revenue',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.CURRENCY
    },
    AVERAGE_TIME_IN_PLAYLISTS: {
        name: 'averageTimeInPlaylist',
        metric: 'averageTimeInPlaylist',
        displayName: 'Average Time in Playlist',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: true,
        isVideoMetric: false,
        dataType: DataTypes.TIME_SECONDS
    },
    AVERAGE_VIEW_DURATION: {
        name: 'averageViewDuration',
        metric: 'averageViewDuration',
        displayName: 'Average View Duration',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: true,
        isVideoMetric: true,
        dataType: DataTypes.TIME_SECONDS
    },
    AVERAGE_VIEW_PERCENTAGE: {
        name: 'averageViewPercentage',
        metric: 'averageViewPercentage',
        displayName: 'Average Percentage Viewed',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.PERCENTAGE
    },
    COMMENTS: {
        name: 'comments',
        metric: 'comments',
        displayName: 'Comments',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    DISLIKES: {
        name: 'dislikes',
        metric: 'dislikes',
        displayName: 'Dislikes',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    LIKES: {
        name: 'likes',
        metric: 'likes',
        displayName: 'Likes',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    PLAYLIST_STARTS: {
        name: 'playlistStarts',
        metric: 'playlistStarts',
        displayName: 'Playlist Starts',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: true,
        isVideoMetric: false,
        dataType: DataTypes.NUMBER
    },
    REVENUE: {
        name: 'revenue',
        metric: 'estimatedRevenue',
        displayName: 'Estimated Revenue',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.CURRENCY
    },
    SHARES: {
        name: 'shares',
        metric: 'shares',
        displayName: 'Shares',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    SUBSCRIBERS: {
        name: 'subscribers',
        metric: null,
        displayName: 'Subscribers',
        shouldUseMetricForGraph: false,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    SUBSCRIBERS_GAINED: {
        name: 'subscribersGained',
        metric: 'subscribersGained',
        displayName: 'Subscribers Gained',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    SUBSCRIBERS_LOST: {
        name: 'subscribersLost',
        metric: 'subscribersLost',
        displayName: 'Subscribers Lost',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    VIDEOS_ADDED_TO_PLAYLISTS: {
        name: 'videosAddedToPlaylists',
        metric: 'videosAddedToPlaylists',
        displayName: 'Videos Added to Playlists',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    VIDEOS_IN_PLAYLISTS: {
        name: 'videosInPlaylists',
        metric: null,
        displayName: 'Videos in Playlists',
        shouldUseMetricForGraph: false,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    VIDEOS_REMOVED_FROM_PLAYLISTS: {
        name: 'videosRemovedFromPlaylists',
        metric: 'videosRemovedFromPlaylists',
        displayName: 'Videos Removed from Playlists',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    VIEWS: {
        name: 'views',
        metric: 'views',
        displayName: 'Views',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: true,
        isVideoMetric: true,
        dataType: DataTypes.NUMBER
    },
    VIEWS_PER_PLAYLIST_START: {
        name: 'viewsPerPlaylistStart',
        metric: 'viewsPerPlaylistStart',
        displayName: 'Views per Playlist Start',
        shouldUseMetricForGraph: true,
        isPlaylistMetric: true,
        isVideoMetric: false,
        dataType: DataTypes.DECIMAL
    },
    WATCH_TIME: {
        name: 'watchTime',
        metric: 'estimatedMinutesWatched',
        displayName: 'Watch Time (minutes)',
        shouldUseMetricForGraph: false,
        isPlaylistMetric: true,
        isVideoMetric: true,
        dataType: DataTypes.TIME_MINUTES
    },
    YOUTUBE_RED_REVENUE: {
        name: 'youtubeRedRevenue',
        metric: 'estimatedRedPartnerRevenue',
        shouldUseMetricForGraph: true,
        displayName: 'Estimated YouTube Red Revenue',
        isPlaylistMetric: false,
        isVideoMetric: true,
        dataType: DataTypes.CURRENCY
    }
};

export default Metrics;