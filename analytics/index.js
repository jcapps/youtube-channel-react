/* eslint-disable import/default */
import React from 'react';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {Route} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import {isLoggedIn} from './actions/loginActions';
import App from './components/App';

const AnalyticsApp = () => {
    const store = configureStore();
    store.dispatch(isLoggedIn());
    
    return (
        <Provider store={store}>
            <Router>
                <Route path="/analytics" component={App} />
            </Router>
        </Provider>
    );
};

export default AnalyticsApp;