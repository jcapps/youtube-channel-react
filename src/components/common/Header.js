import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import TitleBar from './TitleBar';
import NavBar from './navbar/NavBar';

class Header extends React.Component {
    render() {
        return (
            <header>
                <TitleBar channel={this.props.channel}/>
                <NavBar/>
            </header>
        );
    }
}

Header.propTypes = {
    channel: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        channel: state.channelInfo
    };
}

export default connect(mapStateToProps)(Header);