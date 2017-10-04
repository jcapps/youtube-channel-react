import React from 'react';
import {Switch, Route} from 'react-router';
import Metrics from '../globals/Metrics';
import AnalyticsHomePage from './home/AnalyticsHomePage';
import CommentsPage from './comments/CommentsPage';
import DislikesPage from './likes/DislikesPage';
import LikesPage from './likes/LikesPage';
import RevenuePage from './revenue/RevenuePage';
import AdRevenuePage from './revenue/AdRevenuePage';
import YouTubeRedRevenuePage from './revenue/YouTubeRedRevenuePage';
import SharesPage from './shares/SharesPage.js';
import SubscribersPage from './subscribers/SubscribersPage.js';
import SubscribersGainedPage from './subscribers/SubscribersGainedPage.js';
import SubscribersLostPage from './subscribers/SubscribersLostPage.js';
import ViewsPage from './views/ViewsPage';
import WatchTimePage from './views/WatchTimePage';
import YouTubeRedViewsPage from './views/YouTubeRedViewsPage';
import YouTubeRedWatchTimePage from './views/YouTubeRedWatchTimePage';
import PlaylistStartsPage from './views/PlaylistStartsPage';
import AverageViewDurationPage from './retention/AverageViewDurationPage';
import AverageViewPercentagePage from './retention/AverageViewPercentagePage';
import AverageTimeInPlaylistPage from './retention/AverageTimeInPlaylistPage';
import ViewsPerPlaylistStartPage from './retention/ViewsPerPlaylistStartPage';
import VideosInPlaylistsPage from './videosInPlaylists/VideosInPlaylistsPage';
import VideosAddedToPlaylistsPage from './videosInPlaylists/VideosAddedToPlaylistsPage';
import VideosRemovedFromPlaylistsPage from './videosInPlaylists/VideosRemovedFromPlaylistsPage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
            <Route path={`/analytics/${Metrics.AD_REVENUE.name}`} component={AdRevenuePage} />
            <Route path={`/analytics/${Metrics.AVERAGE_TIME_IN_PLAYLISTS.name}`} component={AverageTimeInPlaylistPage} />
            <Route path={`/analytics/${Metrics.AVERAGE_VIEW_DURATION.name}`} component={AverageViewDurationPage} />
            <Route path={`/analytics/${Metrics.AVERAGE_VIEW_PERCENTAGE.name}`} component={AverageViewPercentagePage} />
            <Route path={`/analytics/${Metrics.COMMENTS.name}`} component={CommentsPage} />
            <Route path={`/analytics/${Metrics.DISLIKES.name}`} component={DislikesPage} />
            <Route path={`/analytics/${Metrics.LIKES.name}`} component={LikesPage} />
            <Route path={`/analytics/${Metrics.PLAYLIST_STARTS.name}`} component={PlaylistStartsPage} />
            <Route path={`/analytics/${Metrics.REVENUE.name}`} component={RevenuePage} />
            <Route path={`/analytics/${Metrics.SHARES.name}`} component={SharesPage} />
            <Route path={`/analytics/${Metrics.SUBSCRIBERS.name}`} component={SubscribersPage} />
            <Route path={`/analytics/${Metrics.SUBSCRIBERS_GAINED.name}`} component={SubscribersGainedPage} />
            <Route path={`/analytics/${Metrics.SUBSCRIBERS_LOST.name}`} component={SubscribersLostPage} />
            <Route path={`/analytics/${Metrics.VIDEOS_ADDED_TO_PLAYLISTS.name}`} component={VideosAddedToPlaylistsPage} />
            <Route path={`/analytics/${Metrics.VIDEOS_IN_PLAYLISTS.name}`} component={VideosInPlaylistsPage} />
            <Route path={`/analytics/${Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.name}`} component={VideosRemovedFromPlaylistsPage} />
            <Route path={`/analytics/${Metrics.VIEWS.name}`} component={ViewsPage} />
            <Route path={`/analytics/${Metrics.VIEWS_PER_PLAYLIST_START.name}`} component={ViewsPerPlaylistStartPage} />
            <Route path={`/analytics/${Metrics.WATCH_TIME.name}`} component={WatchTimePage} />
            <Route path={`/analytics/${Metrics.YOUTUBE_RED_REVENUE.name}`} component={YouTubeRedRevenuePage} />
            <Route path={`/analytics/${Metrics.YOUTUBE_RED_VIEWS.name}`} component={YouTubeRedViewsPage} />
            <Route path={`/analytics/${Metrics.YOUTUBE_RED_WATCH_TIME.name}`} component={YouTubeRedWatchTimePage} />
        </Switch>
    );
};

export default Routes;