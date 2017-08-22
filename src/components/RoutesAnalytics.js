import React from 'react';
import {Switch, Route} from 'react-router';
import AnalyticsHomePage from './analytics/home/AnalyticsHomePage';

const RoutesAnalytics = () => {
    return (
        <Switch>
            <Route exact path="/analytics" component={AnalyticsHomePage} />
        </Switch>
    );
};

export default RoutesAnalytics;