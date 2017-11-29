import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../actions/playlistActions';
import PlaylistResult from './PlaylistResult';

export class AllPlaylistsPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
        this.loadMorePlaylists = this.loadMorePlaylists.bind(this);
    }

    componentWillMount() {
        this.props.actions.getAllPlaylists();
    }

    componentDidMount() {
        document.title = "Playlists";
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    loadMorePlaylists() {
        this.setState({ isLoading: true });
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

    renderContent() {
        const playlists = this.props.playlists;
        return (
            <div>
                <h2>Playlists</h2>
                <div className="search-list">
                    {playlists.map(playlist =>
                        <PlaylistResult playlist={playlist} key={playlist.id}/>
                    )}
                    {this.renderViewMore()}
                </div>
            </div>
        );
    }

    render() {
        const loadingSpinner = require('../../images/loading.gif');
        if (this.props.isLoading) return (
            <div>
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );

        let hiddenClass = 'hidden';
        if (this.state.isLoading) {
            hiddenClass = '';
        }

        return (
            <div className="search-results">
                {this.renderContent()}
                <img className={`loading-spinner ${hiddenClass}`} src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

AllPlaylistsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    playlists: PropTypes.array.isRequired,
    playlistPageToken: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return { 
        playlists: state.allPlaylists,
        playlistPageToken: state.playlistPageToken,
        isLoading: state.ajaxCallsInProgress.allPlaylists > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            (!next.isLoading) && 
            (prev.playlistPageToken !== next.playlistPageToken)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AllPlaylistsPage);