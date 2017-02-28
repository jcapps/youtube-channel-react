import React, {PropTypes} from 'react';

const TitleBar = ({channel}) => {
    let profilePicUrl = "";
    if (channel.snippet) {
        profilePicUrl = channel.snippet.thumbnails.default.url;
    }
    return (
        <div id="titlebar">
            <img id="profile-thumbnail" src={profilePicUrl} alt="Profile Thumbnail" />
            <h3>James Capps' YouTube Channel</h3>
        </div>
    );
};

TitleBar.propTypes = {
    channel: PropTypes.object.isRequired
};

export default TitleBar;