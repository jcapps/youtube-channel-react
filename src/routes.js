import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import PlaylistPage from './components/playlist/PlaylistPage';
import AllPlaylistsPage from './components/playlist/AllPlaylistsPage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="/playlist(/:id)" component={PlaylistPage} />
        <Route path="/playlists" component={AllPlaylistsPage} />
    </Route>
);