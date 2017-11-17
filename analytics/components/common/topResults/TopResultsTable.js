import React from 'react';
import PropTypes from 'prop-types';
import TopResultsRow from './TopResultsRow';

export class TopResultsTable extends React.PureComponent {
    renderTableHeader(content) {
        if (this.props.isPlaylistMetrics) {
            return (
                <tr>
                    <th>{content}</th>
                    <th>Playlist Starts</th>
                    <th>Views</th>
                    <th>Watch Time (minutes)</th>
                </tr>
            );
        }
        return (
            <tr>
                <th>{content}</th>
                <th>Views</th>
                <th>Watch Time (minutes)</th>
                <th>YouTube Red Views</th>
                <th>YouTube Red Watch Time (minutes)</th>
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
    isPlaylistMetrics: PropTypes.bool.isRequired
};

export default TopResultsTable;