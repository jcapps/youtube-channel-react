// This component handles the App template used on every page.
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Header from './common/Header';

class App extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <div id="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.object.isRequired
};

export default App;