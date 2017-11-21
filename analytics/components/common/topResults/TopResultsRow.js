import React from 'react';
import PropTypes from 'prop-types';
import Metrics from '../../../globals/Metrics';
import addGraphFilter from '../../../helpers/addGraphFilter';

export class TopResultsRow extends React.PureComponent {
    constructor() {
        super();
        this.addFilter = this.addFilter.bind(this);
    }

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

    addFilter(e) {
        e.preventDefault();
        const content = JSON.parse(e.target.previousSibling.value);
        const state = this.props.filterState;

        const {newFiltersArray, newAddedFiltersArray, newContentType}
            = addGraphFilter(content, state.contentType, state.filters, state.addedFilters);

        const {timePeriod, dateRange} = state;
        this.props.onChangeFilters({
            contentType: newContentType,
            timePeriod,
            dateRange,
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });
    }

    render() {
        const content = this.props.content;

        if (this.props.isPlaylistMetrics) {
            return (
                <tr className="top-results-row">
                    <td>
                        <div className="content-title">
                            <input className="hidden" value={JSON.stringify(content)} readOnly="readOnly" />
                            <a onClick={this.addFilter}>{content.snippet.title}</a>
                        </div>
                    </td>
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
            <tr className="top-results-row">
                <td>
                    <div className="content-title">
                        <input className="hidden" value={JSON.stringify(content)} readOnly="readOnly" />
                        <a onClick={this.addFilter}>{content.snippet.title}</a>
                    </div>
                </td>
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
    content: PropTypes.object.isRequired,
    result: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    sort: PropTypes.string.isRequired,
    isPlaylistMetrics: PropTypes.bool.isRequired,
    onChangeFilters: PropTypes.func.isRequired,
    filterState: PropTypes.object.isRequired
};

export default TopResultsRow;