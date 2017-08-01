import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/player/VideoPlayer';

export class HomePage extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        this.props.actions.getMostRecentUpload().then(() => {
            this.setState({ isLoading: this.props.isLoading });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mostRecentUpload.id == nextProps.mostRecentUpload.id) {
            this.setState({ isLoading: false });
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.mostRecentUpload.id != nextProps.mostRecentUpload.id) {
            return true;
        }
        if (!document.getElementById('home-page')) {
            return true;
        }
        return false;
    }

    render() {
        if (this.state.isLoading) { return <div />; }
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

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);