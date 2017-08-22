// This component handles the App template used on every page.
import React from 'react';
import SideBar from './common/SideBar';
import Routes from './Routes';

class App extends React.PureComponent {
    render() {
        return (
            <div id="analytics-app">
                <SideBar/>
                <div id="analytics-content">
                    <Routes/>
                </div>
            </div>
        );
    }
}

export default App;