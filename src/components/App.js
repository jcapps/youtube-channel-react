// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Header from './common/Header';
import Routes from './Routes';

export class App extends React.PureComponent {
    render() {
        if (this.props.isLoading) return <div/>;
        return (
            <div>
                <Header/>
                <div id="content">
                    <Routes />
                </div>
            </div>
        );
    }
}

App.propTypes = {
    isLoading: PropTypes.bool.isRequired
};

export function mapStateToProps(state) {
    return {
        isLoading: state.ajaxCallsInProgress.channel > 0
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (prev.isLoading !== next.isLoading)
        );
    }
};

export default connect(mapStateToProps, null, null, connectOptions)(App);