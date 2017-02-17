import React, {PropTypes} from 'react';

const PlaylistThumbnail = ({playlist}) => {
    return (
        <div>
            <img src={playlist.snippet.thumbnails.medium.url} alt={playlist.snippet.title}/>
            <h3>{playlist.snippet.title}</h3>
        </div>
    );
};

PlaylistThumbnail.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default PlaylistThumbnail;