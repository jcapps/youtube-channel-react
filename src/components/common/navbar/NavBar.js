import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import PlaylistLink from './PlaylistLink';

export class NavBar extends React.PureComponent {
    constructor() {
        super();
        this.showSubmenu = this.showSubmenu.bind(this);
        this.hideSubmenu = this.hideSubmenu.bind(this);
    }

    showSubmenu(e) {
        let element = e.target;
        while (!element.classList.contains("has-submenu")) {
            element = element.parentNode;
        }
        element.children[1].classList.remove("hidden");
    }

    hideSubmenu(e) {
        let element = e.target;
        while (!element.classList.contains("has-submenu")) {
            element = element.parentNode;
        }
        element.children[1].classList.add("hidden");
    }

    render() {
        let allPlaylists = this.props.allPlaylists;
        return (
            <div id="navbar">
                <nav>
                    <ul>
                        <li><Link to="/"><div>Home</div></Link></li>
                        <li className="has-submenu" onMouseOver={this.showSubmenu} onMouseOut={this.hideSubmenu}>
                            <Link to="/playlists"><div>Playlists</div></Link>
                            <ul className="hidden">
                                {allPlaylists.map(playlist => <PlaylistLink key={playlist.id} playlist={playlist} />)}
                                <li><Link to="/playlists"><div className="nav-view-all">View All</div></Link></li>
                            </ul>
                        </li>
                        <li><Link to="/videos"><div>Videos</div></Link></li>
                        <li><Link to="/about"><div>About</div></Link></li>
                        <li id="analytics-tab"><Link to="/analytics"><div>Analytics</div></Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

NavBar.propTypes = {
    allPlaylists: PropTypes.array.isRequired
};

export default NavBar;