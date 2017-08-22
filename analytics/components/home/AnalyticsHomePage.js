import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginActions from '../../actions/loginActions';
import * as channelActions from '../../actions/channelActions';

export class AnalyticsHomePage extends React.PureComponent {
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.getChannelViews = this.getChannelViews.bind(this);
    }

    componentWillMount() {
        this.props.loginActions.isLoggedIn();
    }

    componentDidMount() {
        document.title = "Analytics: Home";
        window.scrollTo(0, 0);
    }

    login() {
        this.props.loginActions.login();
    }

    getChannelViews() {
        this.props.channelActions.getChannelAnalytics();
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (!this.props.isLoggedIn) {
            return (
                <div id="analytics-home-page">
                    <div className="jumbotron">
                        <h2>YouTube Analytics</h2>
                        <p>You need to login as James Capps to view the channel's analytics.</p>
                        <button onClick={this.login}>Login</button>
                    </div>
                </div>
            );
        }
        return (
            <div id="analytics-home-page">
                <h2>YouTube Analytics</h2>
                <button onClick={this.getChannelViews}>Get Views</button>
            </div>
        );
    }
}

AnalyticsHomePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    loginActions: PropTypes.object.isRequired,
    channelActions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        isLoggedIn: state.isAuthenticated,
        isLoading: state.ajaxCallsInProgress.login > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        loginActions: bindActionCreators(loginActions, dispatch),
        channelActions: bindActionCreators(channelActions, dispatch)
    };
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !(
            (!next.isLoading || prev.isLoggedIn !== next.isLoggedIn)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AnalyticsHomePage);