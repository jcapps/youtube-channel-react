/* eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Perf from 'react-addons-perf';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {Route} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import {getChannelInfo} from './actions/channelActions';
import App from './components/App';
import './styles/styles.scss';
import '../analytics/styles/styles.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/toastr/build/toastr.min.css';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    window.Perf = Perf;
}

const store = configureStore();
store.dispatch(getChannelInfo());

render(
    <Provider store={store}>
        <Router>
            <Route path="/" component={App} />
        </Router>
    </Provider>,
    document.getElementById('app')
);