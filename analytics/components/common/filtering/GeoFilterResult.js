import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

class GeoFilterResult extends React.PureComponent {
    componentDidMount() {
        this.renderFlag();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.result.cca3 != nextProps.result.cca3) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        this.renderFlag();
    }

    renderFlag() {
        const result = this.props.result;
        const div = this.refs.flag;
        if (div.children.length > 0) {
            div.innerHTML = '';
        }

        const iso = result.cca3.toLowerCase();
        const flagHtmlString = require(`world-countries/data/${iso}.svg`);
        const nodes = $.parseHTML(flagHtmlString);
        let flagSvg;
        for (let node of nodes) {
            if (node.tagName && node.tagName == 'svg') {
                flagSvg = node;
                break;
            }
        }

        if (!flagSvg.getAttribute('viewBox')) {
            const currentHeight = flagSvg.getAttribute('height');
            const currentWidth = flagSvg.getAttribute('width');
            flagSvg.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);
        }
        flagSvg.setAttribute('height', '22.5');
        flagSvg.setAttribute('width', '40');

        div.appendChild(flagSvg);
    }

    render() {
        const result = this.props.result;

        return (
            <div className="result-thumbnail">
                <div ref="flag" className="result-flag"/>
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