import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Metrics from '../../../globals/Metrics';
import TopResultsEntry from './TopResultsEntry';

export class TopResultsRow extends React.PureComponent {
    getValue(columnName) {
        const result = this.props.result;
        const columns = this.props.columns;
        
        let value;
        let index = -1;
        if (columns.indexOf(columnName) > -1) {
            index = columns.indexOf(columnName);
        }
        if (index >= 0) {
            value = result[index];
        }
        return value;
    }

    render() {
        return (
            <tr id="top-results-row">
                <TopResultsEntry videoId={this.getValue('video')} />
                <td>{this.getValue(Metrics.VIEWS.metric).toLocaleString()}</td>
                <td>{this.getValue(Metrics.WATCH_TIME.metric).toLocaleString()}</td>
                <td>{this.getValue(Metrics.YOUTUBE_RED_VIEWS.metric).toLocaleString()}</td>
                <td>{this.getValue(Metrics.YOUTUBE_RED_WATCH_TIME.metric).toLocaleString()}</td>
            </tr>
        );
    }
}

TopResultsRow.propTypes = {
    result: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
};

export default TopResultsRow;