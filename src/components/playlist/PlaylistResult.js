import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class PlaylistResult extends React.PureComponent {
    shouldComponentUpdate(nextProps) {
        return this.props.playlist.id !== nextProps.playlist.id;
    }

    render() {
        let playlistId;
        const playlist = this.props.playlist;
        if (playlist.kind == 'youtube#searchResult') {
            playlistId = playlist.id.playlistId;
        } else {
            playlistId = playlist.id;
        }
        return (
            <Link to={"/playlist/" + playlistId}>
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
            </Link>
        );
    }
}

PlaylistResult.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default PlaylistResult;