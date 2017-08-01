import React from 'react';
import PropTypes from 'prop-types';

const PlaylistResult = ({playlist}) => {
    return (
        <div className="playlist-result">
            <img
                height="90"
                width="160"
                title={playlist.snippet.title}
                src={playlist.snippet.thumbnails.medium.url}
                alt={playlist.snippet.title}/>
            <div>
                <h3>{playlist.snippet.title}</h3>
                <p>{playlist.snippet.description}</p>
            </div>
        </div>
    );
};

PlaylistResult.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default PlaylistResult;