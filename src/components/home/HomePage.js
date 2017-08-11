import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/player/VideoPlayer';

export class HomePage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
    }

    componentWillMount() {
        if (!this.props.mostRecentUpload.id) {
            this.props.actions.getMostRecentUpload();
        } else {
            this.setState({ isLoading: false });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) return <div/>;
        return(
            <div id="home-page">
                <h2>Most Recent Upload</h2>
                <VideoPlayer video={this.props.mostRecentUpload}/>
            </div>
        );
    }
}

HomePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    mostRecentUpload: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { 
        mostRecentUpload: state.mostRecentUpload,
        isLoading: state.ajaxCallsInProgress.home > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(videoActions, dispatch) };
}

const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading && prev.mostRecentUpload !== next.mostRecentUpload)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(HomePage);