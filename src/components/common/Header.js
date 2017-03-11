import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import TitleBar from './TitleBar';
import NavBar from './navbar/NavBar';
import SubscribeButton from './SubscribeButton';

export class Header extends React.Component {
    render() {
        return (
            <header>
                <div>
                    <TitleBar channel={this.props.channel}/>
                    <SubscribeButton/>
                </div>
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