import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import VideoThumbnail from '../common/VideoThumbnail';

class AllVideosPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            recentUploadsPlaylist: Object.assign([], props.recentUploadsPlaylist)
        };
    }

    render() {
        const recentUploadsPlaylist = this.state.recentUploadsPlaylist;
        return (
            <div id="videos-page">
                <h2>Videos</h2>
                <div id="video-list">
                    {recentUploadsPlaylist.map(video => {
                        const id = video.snippet.resourceId.videoId;
                        return (
                            <div className="video-result" key={id}>
                                <VideoThumbnail videoId={id}/>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

AllVideosPage.propTypes = {
    recentUploadsPlaylist: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return { 
        recentUploadsPlaylist: state.recentUploadsPlaylist
    };
}

function mapDispatchToProps(dispatch) {
    return {  };
}

export default connect(mapStateToProps, null)(AllVideosPage);