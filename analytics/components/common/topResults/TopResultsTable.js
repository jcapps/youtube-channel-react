import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Metrics from '../../../globals/Metrics';
import TopResultsRow from './TopResultsRow';
import * as playlistActions from '../../../actions/playlistActions';
import * as videoActions from '../../../actions/videoActions';
import * as reportActions from '../../../actions/reportActions';

export class TopResultsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sort: props.sort,
            isLoading: props.isLoading
        };
        this.getTableData = this.getTableData.bind(this);
        this.changeTableSort = this.changeTableSort.bind(this);
        this.renderTableRows = this.renderTableRows.bind(this);
    }

    componentWillMount() {
        this.getTableData(this.props.sort);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) this.setState({isLoading: false});

        const data = nextProps.data;
        if (JSON.stringify(this.props.data) == JSON.stringify(data)) {
            if (JSON.stringify(this.props.filterState) != JSON.stringify(nextProps.filterState)) {
                this.getTableData(nextProps.sort, nextProps);
            }
            return;
        }
        if (!data.rows) return;
        this.setState({isLoading: true});
        if (this.props.isPlaylistMetrics != nextProps.isPlaylistMetrics) {
            this.setState({sort: nextProps.sort});
        }

        const columns = data.columnHeaders.map(item => {
            return item.name;
        });

        let content = 'Video';
        let contentIndex = columns.indexOf('video');
        if (columns.indexOf('playlist') >= 0) {
            content = 'Playlist';
            contentIndex = columns.indexOf('playlist');
        }

        let contentIds = [];
        data.rows.forEach(row => {
            contentIds.push(row[contentIndex]);
        });
        const contentIdString = contentIds.join(',');

        if (content == 'Video') {
            this.props.actions.getVideo(contentIdString);
        } else {
            this.props.actions.getPlaylistInfo(contentIdString);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Length of content list should equal length of data rows
        if (nextProps.data.rows) {
            if (nextProps.isPlaylistMetrics) {
                if (nextProps.playlistList.length != nextProps.data.rows.length) return false;
            } else {
                if (nextProps.videoList.length != nextProps.data.rows.length) return false;
            }
        }
        // Don't highlight new column until data is received
        if (this.state.sort != nextState.sort) {
            return false;
        }
        return true;
    }

    setSelected(metric) {
        if (this.state.sort == metric) {
            return 'column-selected';
        }
        return '';
    }

    getTableData(sort, props = this.props) {
        this.setState({sort: sort});

        const {
            timePeriod,
            dateRange,
            filters
        } = props.filterState;

        let dimensions = 'video';
        let metrics = [
            Metrics.VIEWS.metric,
            Metrics.WATCH_TIME.metric,
            Metrics.YOUTUBE_RED_VIEWS.metric,
            Metrics.YOUTUBE_RED_WATCH_TIME.metric
        ];
        if (props.isPlaylistMetrics) {
            dimensions = 'playlist';
            metrics = [
                Metrics.PLAYLIST_STARTS.metric,
                Metrics.VIEWS.metric,
                Metrics.WATCH_TIME.metric
            ];
        }

        this.props.actions.getTopResultsReport(
            timePeriod,
            dateRange,
            metrics,
            filters,
            dimensions,
            '-' + sort
        );
    }

    changeTableSort(e) {
        this.getTableData(e.target.name);
    }

    renderTableHeader(content) {
        if (this.props.isPlaylistMetrics) {
            return (
                <tr>
                    <th>{content}</th>
                    <th className={this.setSelected(Metrics.PLAYLIST_STARTS.metric)}>
                        <a name={Metrics.PLAYLIST_STARTS.metric} onClick={this.changeTableSort}>
                            {Metrics.PLAYLIST_STARTS.displayName}
                        </a>
                    </th>
                    <th className={this.setSelected(Metrics.VIEWS.metric)}>
                        <a name={Metrics.VIEWS.metric} onClick={this.changeTableSort}>
                            {Metrics.VIEWS.displayName}
                        </a>
                    </th>
                    <th className={this.setSelected(Metrics.WATCH_TIME.metric)}>
                        <a name={Metrics.WATCH_TIME.metric} onClick={this.changeTableSort}>
                            {Metrics.WATCH_TIME.displayName}
                        </a>
                    </th>
                </tr>
            );
        }
        return (
            <tr>
                <th>{content}</th>
                <th className={this.setSelected(Metrics.VIEWS.metric)}>
                    <a name={Metrics.VIEWS.metric} onClick={this.changeTableSort}>
                        {Metrics.VIEWS.displayName}
                    </a>
                </th>
                <th className={this.setSelected(Metrics.WATCH_TIME.metric)}>
                    <a name={Metrics.WATCH_TIME.metric} onClick={this.changeTableSort}>
                        {Metrics.WATCH_TIME.displayName}
                    </a>
                </th>
                <th className={this.setSelected(Metrics.YOUTUBE_RED_VIEWS.metric)}>
                    <a name={Metrics.YOUTUBE_RED_VIEWS.metric} onClick={this.changeTableSort}>
                        {Metrics.YOUTUBE_RED_VIEWS.displayName}
                    </a>
                </th>
                <th className={this.setSelected(Metrics.YOUTUBE_RED_WATCH_TIME.metric)}>
                    <a name={Metrics.YOUTUBE_RED_WATCH_TIME.metric} onClick={this.changeTableSort}>
                        {Metrics.YOUTUBE_RED_WATCH_TIME.displayName}
                    </a>
                </th>
            </tr>
        );
    }

    renderTableRows(data, content, columns) {
        return data.rows.map((result, i) => {
            return (
                <TopResultsRow
                    key={i}
                    content={content[i]}
                    result={result}
                    columns={columns}
                    sort={this.state.sort}
                    isPlaylistMetrics={this.props.isPlaylistMetrics}
                    onChangeFilters={this.props.onChangeFilters}
                    filterState={this.props.filterState}
                />
            );
        });
    }

    render() {
        const data = this.props.data;
        const loadingSpinner = require('../../../images/loading.gif');
        if (this.state.isLoading && !data.rows) {
            return (
                <div>
                    <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
                </div>
            );
        };
        if (!data.rows) return <div/>;

        const columns = data.columnHeaders.map(item => {
            return item.name;
        });

        let contentTitle = 'Video';
        let content = this.props.videoList;
        if (columns.indexOf('playlist') >= 0) {
            contentTitle = 'Playlist';
            content = this.props.playlistList;
        }

        let hiddenClass = 'hidden';
        if (this.state.isLoading) {
            hiddenClass = '';
        }

        return (
            <div>
                <table id="top-results-table">
                    <thead>
                        {this.renderTableHeader(contentTitle)}
                    </thead>
                    <tbody>
                        {this.renderTableRows(data, content, columns)}
                    </tbody>
                </table>
                <img className={`loading-spinner ${hiddenClass}`} src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

TopResultsTable.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    sort: PropTypes.string.isRequired,
    playlistList: PropTypes.array.isRequired,
    videoList: PropTypes.array.isRequired,
    isPlaylistMetrics: PropTypes.bool.isRequired,
    onChangeFilters: PropTypes.func.isRequired,
    filterState: PropTypes.object.isRequired
};

export function mapStateToProps(state, props) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.video
        + state.ajaxCallsInProgress.playlistInfo
        + state.ajaxCallsInProgress.topResultsReport;
    

    return {
        data: state.topResultsReport,
        playlistList: state.playlistList,
        videoList: state.videoList,
        filterState: state.filterState,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, videoActions, playlistActions, reportActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (
                (prev.data !== next.data) ||
                (prev.videoList !== next.videoList) ||
                (prev.playlistList !== next.playlistList)
            )
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(TopResultsTable);