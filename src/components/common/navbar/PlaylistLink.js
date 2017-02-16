import React, {PropTypes} from 'react';
import {Link, IndexLink} from 'react-router';

const PlaylistLink = ({playlist}) => {
    return (
        <li><Link to="/"><div>{playlist.snippet.title}</div></Link></li>
    );
};

PlaylistLink.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default PlaylistLink;