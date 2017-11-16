import React from 'react';
import PropTypes from 'prop-types';
import TopResultsRow from './TopResultsRow';

export class TopResultsTable extends React.PureComponent {
    render() {
        const data = this.props.data;
        if (!data.rows) return <div/>;
        
        const columns = data.columnHeaders.map(item => {
            return item.name;
        });

        return (
            <table id="top-results-table">
                <thead>
                    <tr>
                        <th>Video</th>
                        <th>Views</th>
                        <th>Watch Time (minutes)</th>
                        <th>YouTube Red Views</th>
                        <th>YouTube Red Watch Time (minutes)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((result, i) => {
                        return (
                            <TopResultsRow
                                key={i}
                                result={result}
                                columns={columns}
                            />
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

TopResultsTable.propTypes = {
    data: PropTypes.object.isRequired
};

export default TopResultsTable;