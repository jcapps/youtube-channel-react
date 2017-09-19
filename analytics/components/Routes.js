import React from 'react';
import {Switch, Route} from 'react-router';
import AnalyticsHomePage from './home/AnalyticsHomePage';
import DislikesPage from './likes/DislikesPage';
import LikesPage from './likes/LikesPage';
import ViewsPage from './views/ViewsPage';
import WatchTimePage from './views/WatchTimePage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
            <Route path="/analytics/dislikes" component={DislikesPage} />
            <Route path="/analytics/likes" component={LikesPage} />
            <Route path="/analytics/views" component={ViewsPage} />
            <Route path="/analytics/watchTime" component={WatchTimePage} />
        </Switch>
    );
};

export default Routes;