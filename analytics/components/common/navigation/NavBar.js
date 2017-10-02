import React from 'react';
import {Link} from 'react-router-dom';

export class NavBar extends React.PureComponent {
    render() {
        return (
            <div id="analytics-navbar">
                <nav>
                    <ul>
                        <li><Link to="/analytics"><div>Home</div></Link></li>
                        <li><Link to="/analytics/views"><div>Views</div></Link></li>
                        <li><Link to="/analytics/averageViewDuration"><div>Audience Retention</div></Link></li>
                        <li><Link to="/analytics/likes"><div>Likes</div></Link></li>
                        <li><Link to="/analytics/comments"><div>Comments</div></Link></li>
                        <li><Link to="/analytics/shares"><div>Shares</div></Link></li>
                        <li><Link to="/analytics/subscribers"><div>Subscribers</div></Link></li>
                        <li><Link to="/analytics/videosInPlaylists"><div>Videos in Playlists</div></Link></li>
                        <li><Link to="/analytics/revenue"><div>Revenue</div></Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default NavBar;