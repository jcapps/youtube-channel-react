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
                        <li><Link to="/analytics/watchTime"><div>Watch Time</div></Link></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default NavBar;