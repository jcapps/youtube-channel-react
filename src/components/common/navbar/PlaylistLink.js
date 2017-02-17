import React, {PropTypes} from 'react';
import {Link, IndexLink} from 'react-router';

const PlaylistLink = ({playlist}) => {
    return (
        <li>
            <Link to={'/playlist/' + playlist.id}>
                <div>{playlist.snippet.title}</div>
            </Link>
        </li>
    );
};

PlaylistLink.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default PlaylistLink;