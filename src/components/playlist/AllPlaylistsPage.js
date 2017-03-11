import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import PlaylistResult from './PlaylistResult';

export class AllPlaylistsPage extends React.Component {
    constructor() {
        super();
        this.loadMorePlaylists = this.loadMorePlaylists.bind(this);
    }

    componentWillMount() {
        this.props.actions.getAllPlaylists();
    }

    loadMorePlaylists() {
        const nextPageToken = this.props.playlistPageToken.nextPageToken;
        this.props.actions.getNextPlaylists(nextPageToken);
    }

    renderViewMore() {
        if (this.props.playlistPageToken.nextPageToken) {
            return (
                <a id="view-more" onClick={this.loadMorePlaylists}>
                    <div><b>View More</b></div>
                </a>
            );
        }
    }

    render() {
        const playlists = this.props.playlists;
        return (
            <div id="playlists-page">
                <h2>Playlists</h2>
                <div id="playlists-list">
                    {playlists.map(playlist =>
                        <Link to={"/playlist/" + playlist.id} key={playlist.id}>
                            <PlaylistResult playlist={playlist}/>
                        </Link>
                    )}
                    {this.renderViewMore()}
                </div>
            </div>
        );
    }
}

AllPlaylistsPage.propTypes = {
    playlists: PropTypes.array.isRequired,
    playlistPageToken: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return { 
        playlists: state.allPlaylists,
        playlistPageToken: state.playlistPageToken
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPlaylistsPage);