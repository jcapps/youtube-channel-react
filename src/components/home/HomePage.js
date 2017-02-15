import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as recentUploadsActions from '../../actions/recentUploadsActions';

class HomePage extends React.Component {
    render() {
        this.props.actions.getMostRecentUpload().then(video => {
            console.log(video.snippet.title);
        });
        return(
            <div>
                <h1>My App</h1>
            </div>
        );
    }
}

HomePage.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(recentUploadsActions, dispatch) };
}

export default connect(null, mapDispatchToProps)(HomePage);