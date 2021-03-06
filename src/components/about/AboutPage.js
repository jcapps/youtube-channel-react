import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

export class AboutPage extends React.PureComponent {
    componentDidMount() {
        document.title = "About My Channel";
        window.scrollTo(0, 0);
    }

    render() {
        if (this.props.isLoading) {
            const loadingSpinner = require('../../images/loading.gif');
            return (
                <div>
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            );
        }
        if (this.props.channel && this.props.channel.snippet) {
            let profilePicUrl = this.props.channel.snippet.thumbnails.medium.url;
            let description = this.props.channel.snippet.description.split("\n");
            return (
                <div id="about-page">
                    <img id="profile-pic" src={profilePicUrl} alt="Profile Picture" />
                    <h3>About My Channel</h3>
                    <p>
                        {description.map(piece => {
                            return (
                                <span key={piece}>{piece}<br/></span>
                            );
                        })}
                    </p>
                </div>
            );
        } else {
            return <div>(Unable to load About page)</div>;
        }
    }
}

AboutPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        channel: state.channelInfo,
        isLoading: state.ajaxCallsInProgress.about > 0
    };
}

export default connect(mapStateToProps)(AboutPage);