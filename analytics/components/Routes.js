import React from 'react';
import {Switch, Route} from 'react-router';
import AnalyticsHomePage from './home/AnalyticsHomePage';
import CommentsPage from './comments/CommentsPage';
import DislikesPage from './likes/DislikesPage';
import LikesPage from './likes/LikesPage';
import SubscribersPage from './subscribers/SubscribersPage.js';
import SubscribersGainedPage from './subscribers/SubscribersGainedPage.js';
import SubscribersLostPage from './subscribers/SubscribersLostPage.js';
import ViewsPage from './views/ViewsPage';
import WatchTimePage from './views/WatchTimePage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
            <Route path="/analytics/comments" component={CommentsPage} />
            <Route path="/analytics/dislikes" component={DislikesPage} />
            <Route path="/analytics/likes" component={LikesPage} />
            <Route path="/analytics/subscribers" component={SubscribersPage} />
            <Route path="/analytics/subscribersGained" component={SubscribersGainedPage} />
            <Route path="/analytics/subscribersLost" component={SubscribersLostPage} />
            <Route path="/analytics/views" component={ViewsPage} />
            <Route path="/analytics/watchTime" component={WatchTimePage} />
        </Switch>
    );
};

export default Routes;