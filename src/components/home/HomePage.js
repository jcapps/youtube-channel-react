import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as recentUploadsActions from '../../actions/recentUploadsActions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostRecentUpload: Object.assign({}, props.mostRecentUpload)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.mostRecentUpload) {
            this.setState({ mostRecentUpload: Object.assign({}, nextProps.mostRecentUpload) });
        }
    }

    render() {
        const mostRecentUploadId = this.props.mostRecentUpload.id;
        const mostRecentUploadUrl = "https://www.youtube.com/embed/" + mostRecentUploadId;
        return(
            <div id="home-page">
                <h1>My App</h1>
                <iframe width="640" height="360" src={mostRecentUploadUrl}>
                </iframe>
            </div>
        );
    }
}

HomePage.propTypes = {
    mostRecentUpload: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { mostRecentUpload: state.mostRecentUpload };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(recentUploadsActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);