import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import PlaylistPage from './components/playlist/PlaylistPage';
import AllPlaylistsPage from './components/playlist/AllPlaylistsPage';
import AllVideosPage from './components/video/AllVideosPage';
import VideoWatchPage from './components/video/VideoWatchPage';
import AboutPage from './components/about/AboutPage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="/playlist(/:id)" component={PlaylistPage} />
        <Route path="/playlists" component={AllPlaylistsPage} />
        <Route path="/videos" component={AllVideosPage} />
        <Route path="/watch(/:id)" component={VideoWatchPage} />
        <Route path="/about" component={AboutPage} />
    </Route>
);