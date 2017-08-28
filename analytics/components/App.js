import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../actions/loginActions';
import SideBar from './common/SideBar';
import Routes from './Routes';

class App extends React.PureComponent {
    constructor() {
        super();
        this.login = this.login.bind(this);
    }
    
    login() {
        this.props.actions.login();
    }

    render() {
        if (this.props.isCheckingLogin) return <div/>;
        if (!this.props.isLoggedIn) {
            return (
                <div id="analytics-app">
                    <div className="jumbotron">
                        <h2>YouTube Analytics</h2>
                        <p>You need to login as James Capps to view the channel's analytics.</p>
                        <button onClick={this.login}>Login</button>
                    </div>
                </div>
            );
        }
        if (this.props.isLoading) return <div/>;
        return (
            <div id="analytics-app">
                <SideBar/>
                <div id="analytics-content">
                    <Routes/>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    isCheckingLogin: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        isLoggedIn: state.isAuthenticated,
        isCheckingLogin: state.ajaxCallsInProgress.isLoggedIn > 0,
        isLoading: state.ajaxCallsInProgress.login > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(loginActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        if (
            (prev.isLoading !== next.isLoading) || 
            (!next.isLoggedIn) || 
            (!next.isCheckingLogin && (prev.isLoggedIn !== next.isLoggedIn))
        ) console.log('render App', prev, next);
        return !(
            (prev.isLoading !== next.isLoading) || 
            (!next.isLoggedIn) || 
            (!next.isCheckingLogin && (prev.isLoggedIn !== next.isLoggedIn))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(App);