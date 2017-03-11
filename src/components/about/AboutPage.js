import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

export class AboutPage extends React.Component {
    render() {
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
    }
}

AboutPage.propTypes = {
    channel: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        channel: state.channelInfo
    };
}

export default connect(mapStateToProps)(AboutPage);