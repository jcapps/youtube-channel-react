import React from 'react';
import * as youtubeActions from '../../actions/youtubeActions';

class SubscribeButton extends React.PureComponent {
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