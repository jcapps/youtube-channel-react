import React from 'react';
import PropTypes from 'prop-types';

class ContentFilterResult extends React.PureComponent {
    render() {
        const result = this.props.result;
        let width = '40';
        if (result.id.kind == 'youtube#channel') {
            width = '22.5';
        }

        return (
            <div className="result-thumbnail">
                <img
                    height="22.5"
                    width={width}
                    title={result.snippet.title}
                    src={result.snippet.thumbnails.medium.url}
                    alt={result.snippet.title}/>
                <div>
                    <p>{result.snippet.title}</p>
                </div>
            </div>
        );
    }
}

ContentFilterResult.propTypes = {
    result: PropTypes.object.isRequired
};

export default ContentFilterResult;