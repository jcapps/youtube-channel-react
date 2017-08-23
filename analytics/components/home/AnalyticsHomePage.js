import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as channelActions from '../../actions/channelActions';

export class AnalyticsHomePage extends React.PureComponent {
    constructor() {
        super();
        this.getChannelViews = this.getChannelViews.bind(this);
    }

    componentDidMount() {
        document.title = "Analytics: Home";
        window.scrollTo(0, 0);
    }

    getChannelViews() {
        this.props.actions.getChannelAnalytics();
    }

    render() {
        if (this.props.isLoading) return <div/>;
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
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        isLoading: false
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(channelActions, dispatch)
    };
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        return !(
            !next.isLoading
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AnalyticsHomePage);