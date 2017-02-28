import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as videoActions from '../../actions/videoActions';
import VideoPlayer from '../common/VideoPlayer';

class AboutPage extends React.Component {
    render() {
        console.log(this.props.channel);
        return (
            <div>
                <h3>About My Channel</h3>
            </div>
        );
    }
}

AboutPage.propTypes = {
    channel: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        channel: state.channelInfo
    };
}

export default connect(mapStateToProps, null)(AboutPage);