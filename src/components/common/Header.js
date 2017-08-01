import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TitleBar from './TitleBar';
import NavBar from './navbar/NavBar';
import SearchBar from './SearchBar';
import SubscribeButton from './SubscribeButton';

export class Header extends React.Component {
    render() {
        return (
            <header>
                <div>
                    <TitleBar channel={this.props.channel}/>
                    <SubscribeButton/>
                </div>
                <div>
                    <NavBar/>
                    <SearchBar/>
                </div>
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