import React from 'react';
import PropTypes from 'prop-types';
import Metrics from '../../../globals/Metrics';
import TopResultsRow from './TopResultsRow';

export class TopResultsTable extends React.PureComponent {
    setSelected(metric) {
        if (this.props.sort == metric) {
            return 'column-selected';
        }
        return '';
    }

    renderTableHeader(content) {
        if (this.props.isPlaylistMetrics) {
            return (
                <tr>
                    <th>{content}</th>
                    <th className={this.setSelected(Metrics.PLAYLIST_STARTS.metric)}>
                        {Metrics.PLAYLIST_STARTS.displayName}
                    </th>
                    <th className={this.setSelected(Metrics.VIEWS.metric)}>
                        {Metrics.VIEWS.displayName}
                    </th>
                    <th className={this.setSelected(Metrics.WATCH_TIME.metric)}>
                        {Metrics.WATCH_TIME.displayName}
                    </th>
                </tr>
            );
        }
        return (
            <tr>
                <th>{content}</th>
                <th className={this.setSelected(Metrics.VIEWS.metric)}>
                    {Metrics.VIEWS.displayName}
                </th>
                <th className={this.setSelected(Metrics.WATCH_TIME.metric)}>
                    {Metrics.WATCH_TIME.displayName}
                </th>
                <th className={this.setSelected(Metrics.YOUTUBE_RED_VIEWS.metric)}>
                    {Metrics.YOUTUBE_RED_VIEWS.displayName}
                </th>
                <th className={this.setSelected(Metrics.YOUTUBE_RED_WATCH_TIME.metric)}>
                    {Metrics.YOUTUBE_RED_WATCH_TIME.displayName}
                </th>
            </tr>
        );
    }

    render() {
        const data = this.props.data;
        if (!data.rows) return <div/>;

        const columns = data.columnHeaders.map(item => {
            return item.name;
        });

        let content = 'Video';
        if (columns.indexOf('playlist') >= 0) {
            content = 'Playlist';
        }

        return (
            <table id="top-results-table">
                <thead>
                    {this.renderTableHeader(content)}
                </thead>
                <tbody>
                    {data.rows.map((result, i) => {
                        return (
                            <TopResultsRow
                                key={i}
                                result={result}
                                columns={columns}
                                sort={this.props.sort}
                                isPlaylistMetrics={this.props.isPlaylistMetrics}
                            />
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

TopResultsTable.propTypes = {
    data: PropTypes.object.isRequired,
    sort: PropTypes.string.isRequired,
    isPlaylistMetrics: PropTypes.bool.isRequired
};

export default TopResultsTable;