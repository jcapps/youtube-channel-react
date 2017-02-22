import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/VideoPlayer';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mostRecentUpload: Object.assign({}, props.mostRecentUpload)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.mostRecentUpload.id) {
            this.setState({ mostRecentUpload: Object.assign({}, nextProps.mostRecentUpload) });
        }
    }

    render() {
        const mostRecentUpload = this.state.mostRecentUpload;
        if (mostRecentUpload.id) {
            return(
                <div id="home-page">
                    <h2>Most Recent Upload</h2>
                    <VideoPlayer video={mostRecentUpload}/>
                </div>
            );
        }
        return <div>(Video not found.)</div>;
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
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);