import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TitleBar from './TitleBar';
import NavBar from './navbar/NavBar';
import SearchBar from './SearchBar';
import SubscribeButton from './SubscribeButton';
import * as playlistActions from '../../actions/playlistActions';

export class Header extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
    }

    componentWillMount() {
        this.props.actions.getAllPlaylists();
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) return <div/>;
        return (
            <header>
                <div>
                    <TitleBar channel={this.props.channel}/>
                    <SubscribeButton/>
                </div>
                <div>
                    <NavBar allPlaylists={this.props.allPlaylists}/>
                    <SearchBar/>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    allPlaylists: PropTypes.array.isRequired,
    channel: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    const playlists = state.allPlaylists.slice(0, 5);
    return {
        allPlaylists: playlists,
        channel: state.channelInfo,
        isLoading: (state.ajaxCallsInProgress.header > 0 && playlists.length !== 5)
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(playlistActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            prev.isLoading !== next.isLoading
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(Header);