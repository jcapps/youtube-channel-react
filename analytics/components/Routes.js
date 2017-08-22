import React from 'react';
import {Switch, Route} from 'react-router';
import AnalyticsHomePage from './home/AnalyticsHomePage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
        </Switch>
    );
};

export default Routes;