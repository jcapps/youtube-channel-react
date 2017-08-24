import React from 'react';
import {Switch, Route} from 'react-router';
import AnalyticsHomePage from './home/AnalyticsHomePage';
import ViewsPage from './views/ViewsPage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
            <Route path="/analytics/views" component={ViewsPage} />
        </Switch>
    );
};

export default Routes;