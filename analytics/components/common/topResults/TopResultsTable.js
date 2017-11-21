import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Metrics from '../../../globals/Metrics';
import TopResultsRow from './TopResultsRow';
import * as playlistActions from '../../../actions/playlistActions';
import * as videoActions from '../../../actions/videoActions';

export class TopResultsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: props.isLoading
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) this.setState({isLoading: false});

        const data = nextProps.data;
        if (!data.rows) return;
        if (JSON.stringify(this.props.data) == JSON.stringify(data)) return;
        this.setState({isLoading: true});

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
        const loadingSpinner = require('../../../images/loading.gif');
        if (this.state.isLoading) {
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

        return (
            <table id="top-results-table">
                <thead>
                    {this.renderTableHeader(contentTitle)}
                </thead>
                <tbody>
                    {data.rows.map((result, i) => {
                        return (
                            <TopResultsRow
                                key={i}
                                content={content[i]}
                                result={result}
                                columns={columns}
                                sort={this.props.sort}
                                isPlaylistMetrics={this.props.isPlaylistMetrics}
                                onChangeFilters={this.props.onChangeFilters}
                                filterState={this.props.filterState}
                            />
                        );
                    })}
                </tbody>
            </table>
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
        + state.ajaxCallsInProgress.playlistInfo;
    

    return {
        playlistList: state.playlistList,
        videoList: state.videoList,
        filterState: state.filterState,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, videoActions, playlistActions);
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