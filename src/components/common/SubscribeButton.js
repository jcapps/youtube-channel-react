import React from 'react';
import * as youtubeActions from '../../actions/youtubeActions';

class SubscribeButton extends React.Component {
    constructor() {
        super();
        this.subscribe = this.subscribe.bind(this);
    }

    subscribe() {
        youtubeActions.subscribe();
    }

    render() {
        return (
            <div id="subscribe">
                <button onClick={this.subscribe}>Subscribe</button>
            </div>
        );
    }
}

export default SubscribeButton;