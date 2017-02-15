// This component handles the App template used on every page.
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

class App extends React.Component {
    render() {
        return (
            <div>
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