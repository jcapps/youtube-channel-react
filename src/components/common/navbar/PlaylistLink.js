import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

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