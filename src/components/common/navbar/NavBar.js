import React, {PropTypes} from 'react';
import {Link, IndexLink} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlaylistLink from './PlaylistLink';

class NavBar extends React.Component {
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
            <nav>
                <ul>
                    <li><IndexLink to="/"><div>Home</div></IndexLink></li>
                    <li className="has-submenu" onMouseOver={this.showSubmenu} onMouseOut={this.hideSubmenu}>
                        <Link to="/playlists"><div>Playlists</div></Link>
                        <ul className="hidden">
                            {allPlaylists.slice(0, 5).map(playlist => <PlaylistLink key={playlist.id} playlist={playlist} />)}
                            <li><Link to="/playlists"><div className="nav-view-all">View All</div></Link></li>
                        </ul>
                    </li>
                    <li><Link to="/videos"><div>Videos</div></Link></li>
                    <li><Link to="/about"><div>About</div></Link></li>
                </ul>
            </nav>
        );
    }
}

NavBar.propTypes = {
    allPlaylists: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return { allPlaylists: state.allPlaylists };
}

export default connect(mapStateToProps)(NavBar);