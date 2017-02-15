import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as youtubeActions from '../../actions/youtubeActions';

class HomePage extends React.Component {
    render() {
        this.props.actions.getChannelInfo().then(channelInfo => {
            let playlistId = channelInfo.contentDetails.relatedPlaylists.uploads;
            this.props.actions.getPlaylistInfo(playlistId).then(playlist => {
                let videoId = playlist[0].snippet.resourceId.videoId;
                this.props.actions.getVideoInfo(videoId).then(video => {
                    console.log(video.snippet.title);
                });
            });
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
    return { actions: bindActionCreators(youtubeActions, dispatch) };
}

export default connect(null, mapDispatchToProps)(HomePage);