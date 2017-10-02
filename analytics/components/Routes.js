import React from 'react';
import {Switch, Route} from 'react-router';
import AnalyticsHomePage from './home/AnalyticsHomePage';
import CommentsPage from './comments/CommentsPage';
import DislikesPage from './likes/DislikesPage';
import LikesPage from './likes/LikesPage';
import TotalRevenuePage from './revenue/TotalRevenuePage';
import AdRevenuePage from './revenue/AdRevenuePage';
import YouTubeRedRevenuePage from './revenue/YouTubeRedRevenuePage';
import SharesPage from './shares/SharesPage.js';
import SubscribersPage from './subscribers/SubscribersPage.js';
import SubscribersGainedPage from './subscribers/SubscribersGainedPage.js';
import SubscribersLostPage from './subscribers/SubscribersLostPage.js';
import ViewsPage from './views/ViewsPage';
import WatchTimePage from './views/WatchTimePage';
import PlaylistStartsPage from './views/PlaylistStartsPage';
import AverageViewDurationPage from './retention/AverageViewDurationPage';
import AverageViewPercentagePage from './retention/AverageViewPercentagePage';
import AverageTimeInPlaylistPage from './retention/AverageTimeInPlaylistPage';
import ViewsPerPlaylistStartPage from './retention/ViewsPerPlaylistStartPage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
            <Route path="/analytics/adRevenue" component={AdRevenuePage} />
            <Route path="/analytics/averageTimeInPlaylist" component={AverageTimeInPlaylistPage} />
            <Route path="/analytics/averageViewDuration" component={AverageViewDurationPage} />
            <Route path="/analytics/averageViewPercentage" component={AverageViewPercentagePage} />
            <Route path="/analytics/comments" component={CommentsPage} />
            <Route path="/analytics/dislikes" component={DislikesPage} />
            <Route path="/analytics/likes" component={LikesPage} />
            <Route path="/analytics/playlistStarts" component={PlaylistStartsPage} />
            <Route path="/analytics/revenue" component={TotalRevenuePage} />
            <Route path="/analytics/shares" component={SharesPage} />
            <Route path="/analytics/subscribers" component={SubscribersPage} />
            <Route path="/analytics/subscribersGained" component={SubscribersGainedPage} />
            <Route path="/analytics/subscribersLost" component={SubscribersLostPage} />
            <Route path="/analytics/views" component={ViewsPage} />
            <Route path="/analytics/viewsPerPlaylistStart" component={ViewsPerPlaylistStartPage} />
            <Route path="/analytics/watchTime" component={WatchTimePage} />
            <Route path="/analytics/youtubeRedRevenue" component={YouTubeRedRevenuePage} />
        </Switch>
    );
};

export default Routes;