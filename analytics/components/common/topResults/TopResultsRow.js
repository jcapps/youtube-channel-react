import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Metrics from '../../../globals/Metrics';
import TopResultsEntry from './TopResultsEntry';

export class TopResultsRow extends React.PureComponent {
    setSelected(metric) {
        if (this.props.sort == metric) {
            return 'column-selected';
        }
        return '';
    }

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
            if (!!value && columnName != 'video' && columnName != 'playlist') {
                value = value.toLocaleString();
            }
        }
        return value;
    }

    render() {
        if (this.props.isPlaylistMetrics) {
            return (
                <tr id="top-results-row">
                    <TopResultsEntry
                        videoId={this.getValue('video')}
                        playlistId={this.getValue('playlist')}
                        onChangeFilters={this.props.onChangeFilters}
                    />
                    <td className={this.setSelected(Metrics.PLAYLIST_STARTS.metric)}>
                        {this.getValue(Metrics.PLAYLIST_STARTS.metric)}
                    </td>
                    <td className={this.setSelected(Metrics.VIEWS.metric)}>
                        {this.getValue(Metrics.VIEWS.metric)}
                    </td>
                    <td className={this.setSelected(Metrics.WATCH_TIME.metric)}>
                        {this.getValue(Metrics.WATCH_TIME.metric)}
                    </td>
                </tr>
            );
        }
        return (
            <tr id="top-results-row">
                <TopResultsEntry
                    videoId={this.getValue('video')}
                    playlistId={this.getValue('playlist')}
                    onChangeFilters={this.props.onChangeFilters}
                />
                <td className={this.setSelected(Metrics.VIEWS.metric)}>
                    {this.getValue(Metrics.VIEWS.metric)}
                </td>
                <td className={this.setSelected(Metrics.WATCH_TIME.metric)}>
                    {this.getValue(Metrics.WATCH_TIME.metric)}
                </td>
                <td className={this.setSelected(Metrics.YOUTUBE_RED_VIEWS.metric)}>
                    {this.getValue(Metrics.YOUTUBE_RED_VIEWS.metric)}
                </td>
                <td className={this.setSelected(Metrics.YOUTUBE_RED_WATCH_TIME.metric)}>
                    {this.getValue(Metrics.YOUTUBE_RED_WATCH_TIME.metric)}
                </td>
            </tr>
        );
    }
}

TopResultsRow.propTypes = {
    result: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    sort: PropTypes.string.isRequired,
    isPlaylistMetrics: PropTypes.bool.isRequired,
    onChangeFilters: PropTypes.func.isRequired
};

export default TopResultsRow;