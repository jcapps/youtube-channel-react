import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as youtubeActions from '../../actions/youtubeActions';

class SubscribeButton extends React.Component {
    constructor() {
        super();
        this.subscribe = this.subscribe.bind(this);
    }

    subscribe() {
        this.props.actions.subscribe();
    }

    render() {
        return (
            <div id="subscribe">
                <button onClick={this.subscribe}>Subscribe</button>
            </div>
        );
    }
}

SubscribeButton.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(youtubeActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SubscribeButton);