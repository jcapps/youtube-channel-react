import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as playlistActions from '../../../actions/playlistActions';
import * as videoActions from '../../../actions/videoActions';
import addGraphFilter from '../../../helpers/addGraphFilter';
import filterArrayIncludes from '../../../helpers/filterArrayIncludes';

export class TopResultsEntry extends React.PureComponent {
    constructor() {
        super();
        this.addFilter = this.addFilter.bind(this);
    }

    componentWillMount() {
        if (this.props.videoId) {
            this.props.actions.getVideo(this.props.videoId);
        }
        if (this.props.playlistId) {
            this.props.actions.getPlaylistInfo(this.props.playlistId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.videoId &&
            (
                this.props.videoId != nextProps.videoId || 
                JSON.stringify(this.props.filterState) != JSON.stringify(nextProps.filterState)
            )
        ) {
            this.props.actions.getVideo(nextProps.videoId);
        }
        if (
            nextProps.playlistId &&
            (
                this.props.playlistId != nextProps.playlistId || 
                JSON.stringify(this.props.filterState) != JSON.stringify(nextProps.filterState)
            )
        ) {
            this.props.actions.getPlaylistInfo(nextProps.playlistId);
        }
    }

    shouldComponentUpdate(nextProps) {
        // Don't update render when changing filterState
        if (JSON.stringify(this.props.filterState) != JSON.stringify(nextProps.filterState)) {
            return false;
        }
        return true;
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
        let content = this.props.video;
        if (this.props.playlistId) {
            content = this.props.playlist;
        }
        if (!content || !content.snippet) return <td/>;

        return (
            <td>
                <div className="content-title">
                    <input className="hidden" value={JSON.stringify(content)} readOnly="readOnly" />
                    <a onClick={this.addFilter}>
                        {content.snippet.title}
                    </a>
                </div>
            </td>
        );
    }
}

TopResultsEntry.propTypes = {
    video: PropTypes.object,
    videoId: PropTypes.string,
    playlist: PropTypes.object,
    playlistId: PropTypes.string,
    filterState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    onChangeFilters: PropTypes.func.isRequired
};

export function mapStateToProps(state, props) {
    return {
        playlist: state.playlistInfo,
        video: state.video,
        filterState: state.filterState
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, videoActions, playlistActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch)
    };
}

export function mergeProps(state, actions, props) {
    return Object.assign({}, state, actions, props);
}

export const connectOptions = {
    areMergedPropsEqual: (next, prev) => {
        let filterKey = 'video';
        let itemId = next.videoId;
        if (!!next.playlistId) {
            filterKey = 'playlist';
            itemId = next.playlistId;
        }
        const newKey = {key: filterKey, value: itemId};
        const wasEntryFiltered = filterArrayIncludes(next.filterState.filters, newKey);

        return !(
            !!next.videoId &&
            (
                prev.videoId != next.videoId ||
                next.videoId == next.video.id ||
                (
                    JSON.stringify(prev.filterState) != JSON.stringify(next.filterState) &&
                    wasEntryFiltered
                )
            ) ||
            !!next.playlistId &&
            (
                prev.playlistId != next.playlistId ||
                next.playlistId == next.playlist.id ||
                (
                    JSON.stringify(prev.filterState) != JSON.stringify(next.filterState) &&
                    wasEntryFiltered
                )
            )
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, connectOptions)(TopResultsEntry);