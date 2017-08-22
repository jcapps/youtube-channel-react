import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as channelActions from '../../../actions/channelActions';

export class AnalyticsHomePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.login = this.login.bind(this);
        this.getChannelViews = this.getChannelViews.bind(this);
    }

    componentWillMount() {
        this.props.actions.isLoggedIn();
    }

    componentDidMount() {
        document.title = "Analytics: Home";
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    login() {
        this.props.actions.login();
    }

    getChannelViews() {
        this.props.actions.getChannelAnalytics();
    }

    render() {
        if (this.state.isLoading) return <div/>;
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
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        isLoggedIn: state.isAuthenticated,
        isLoading: state.ajaxCallsInProgress.login > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(channelActions, dispatch) };
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !(
            (!next.isLoading || prev.isLoggedIn !== next.isLoggedIn)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AnalyticsHomePage);