import React from 'react';
import NavBar from './NavBar';

export class SideBar extends React.PureComponent {
    render() {
        return (
            <div id="sidebar">
                <NavBar/>
            </div>
        );
    }
}

export default SideBar;