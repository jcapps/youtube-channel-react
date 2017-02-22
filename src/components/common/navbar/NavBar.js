import React, {PropTypes} from 'react';
import {Link, IndexLink} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../../actions/playlistActions';
import PlaylistLink from './PlaylistLink';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPlaylists: Object.assign([], props.allPlaylists)
        };
    }

    componentDidMount() {
        let lis = document.getElementsByClassName("has-submenu");
        for (let li of lis) {
            li.onmouseover = () => {
                li.children[1].classList.remove("hidden");
            };
            li.onmouseout = () => {
                li.children[1].classList.add("hidden");
            };
        }
    }

    render() {
        let allPlaylists = this.props.allPlaylists;
        return (
            <nav>
                <ul>
                    <li><IndexLink to="/"><div>Home</div></IndexLink></li>
                    <li className="has-submenu">
                        <Link to="/playlists"><div>Playlists</div></Link>
                        <ul className="hidden">
                            {allPlaylists.slice(0, 5).map(playlist => <PlaylistLink key={playlist.id} playlist={playlist} />)}
                            <li><Link to="/playlists"><div className="nav-view-all">View All</div></Link></li>
                        </ul>
                    </li>
                    <li><Link to="/videos"><div>Videos</div></Link></li>
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

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(playlistActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);