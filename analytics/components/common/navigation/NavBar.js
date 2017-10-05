import React from 'react';
import {Link} from 'react-router-dom';
import Metrics from '../../../globals/Metrics';

export class NavBar extends React.PureComponent {
    render() {
        return (
            <div id="analytics-navbar">
                <nav>
                    <ul>
                        <li><Link to="/analytics"><div>Home</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.VIEWS.name}`}><div>Views</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.AVERAGE_VIEW_DURATION.name}`}><div>Audience Retention</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.LIKES.name}`}><div>Likes</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.COMMENTS.name}`}><div>Comments</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.SHARES.name}`}><div>Shares</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.SUBSCRIBERS.name}`}><div>Subscribers</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.VIDEOS_IN_PLAYLISTS.name}`}><div>Videos in Playlists</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.CARD_CLICKS.name}`}><div>Cards</div></Link></li>
                        <li><Link to={`/analytics/${Metrics.REVENUE.name}`}><div>Revenue</div></Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default NavBar;