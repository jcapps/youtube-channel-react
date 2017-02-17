import React, {PropTypes} from 'react';

const PlaylistThumbnail = ({playlist}) => {
    return (
        <div className="playlist-thumbnail">
            <img height="90" width="160" src={playlist.snippet.thumbnails.medium.url} alt={playlist.snippet.title}/>
            <div>
                <h3>{playlist.snippet.title}</h3>
                <p>{playlist.snippet.description}</p>
            </div>
        </div>
    );
};

PlaylistThumbnail.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default PlaylistThumbnail;