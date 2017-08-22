// This component handles the App template used on every page.
import React from 'react';
import Header from './common/Header';
import Routes from './Routes';
import RoutesAnalytics from './RoutesAnalytics';

class App extends React.PureComponent {
    render() {
        return (
            <div>
                <Header/>
                <div id="content">
                    <Routes />
                    <RoutesAnalytics />
                </div>
            </div>
        );
    }
}

export default App;