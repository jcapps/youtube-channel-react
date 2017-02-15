import React from 'react';
import {Link, IndexLink} from 'react-router';

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li><IndexLink to="/" activeClassName="active"><div>Home</div></IndexLink></li>
            </ul>
        </nav>
    );
};

export default NavBar;