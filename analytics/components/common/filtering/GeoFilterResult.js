import React from 'react';
import PropTypes from 'prop-types';

class GeoFilterResult extends React.PureComponent {
    render() {
        const result = this.props.result;

        return (
            <div className="result-thumbnail">
                <div>
                    <p>{result.name.common}</p>
                </div>
            </div>
        );
    }
}

GeoFilterResult.propTypes = {
    result: PropTypes.object.isRequired
};

export default GeoFilterResult;