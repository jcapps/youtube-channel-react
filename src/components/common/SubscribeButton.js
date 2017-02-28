import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as channelActions from '../../actions/channelActions';

class SubscribeButton extends React.Component {
    constructor() {
        super();
        this.subscribe = this.subscribe.bind(this);
    }

    subscribe() {
        this.props.actions.subscribe();
    }

    render() {
        console.log(this.props.success);
        return (
            <div id="subscribe">
                <button onClick={this.subscribe}>Subscribe</button>
            </div>
        );
    }
}

SubscribeButton.propTypes = {
    success: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        success: state.subscribeSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(channelActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeButton);