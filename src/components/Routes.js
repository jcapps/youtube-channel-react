import React from 'react';
import {Switch, Route} from 'react-router';
import HomePage from './home/HomePage';
import PlaylistPage from './playlist/PlaylistPage';
import AllPlaylistsPage from './playlist/AllPlaylistsPage';
import AllVideosPage from './video/AllVideosPage';
import VideoWatchPage from './video/VideoWatchPage';
import AboutPage from './about/AboutPage';
import SearchResultsPage from './search/SearchResultsPage';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/playlist/:id?" component={PlaylistPage} />
            <Route path="/playlists" component={AllPlaylistsPage} />
            <Route path="/videos" component={AllVideosPage} />
            <Route path="/watch/:id?" component={VideoWatchPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/search/:q?" component={SearchResultsPage} />
        </Switch>
    );
};

export default Routes;