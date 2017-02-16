import React from 'react';
import TitleBar from './TitleBar';
import NavBar from './navbar/NavBar';

const Header = () => {
    return (
        <header>
            <TitleBar/>
            <NavBar/>
        </header>
    );
};

export default Header;