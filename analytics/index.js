/* eslint-disable import/default */
import React from 'react';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {Route} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import {isLoggedIn} from './actions/loginActions';
import {getChannelInfo} from './actions/channelActions';
import App from './components/App';

const store = configureStore();

class AnalyticsApp extends React.PureComponent {
    componentWillMount() {
        store.dispatch(isLoggedIn());
        store.dispatch(getChannelInfo());
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Route path="/analytics" component={App} />
                </Router>
            </Provider>
        );
    }   
}

export default AnalyticsApp;