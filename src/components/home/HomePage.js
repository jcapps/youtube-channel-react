import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import VideoPlayer from '../common/VideoPlayer';

export class HomePage extends React.Component {
    render() {
        if (this.props.isLoading) { return <div></div>; }
        const mostRecentUpload = this.props.mostRecentUpload;
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
    isLoading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    return { 
        mostRecentUpload: state.mostRecentUpload,
        isLoading: state.ajaxCallsInProgress > 0
    };
}

export default connect(mapStateToProps)(HomePage);