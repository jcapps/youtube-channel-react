import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../../globals/ContentTypes';
import * as channelActions from '../../../actions/channelActions';
import {clearSearchResults} from '../../../actions/clearAction';
import DownshiftSectioned from './DownshiftSectioned';
import FilterResult from './FilterResult';

class ContentFilter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownOpen: false,
            resultsArray: []
        };
        this.addContentFilter = this.addContentFilter.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
        this.search = this.search.bind(this);
        this.computeResultValue = this.computeResultValue.bind(this);
        this.onDownshiftChange = this.onDownshiftChange.bind(this);
        this.onDownshiftStateChange = this.onDownshiftStateChange.bind(this);
    }

    componentDidMount() {
        $(document).click(e => {
            if (!$(e.target).closest('#content-filter').length) {
                this.onSearchBlur();
            }
        });
    }

    componentWillUnmount() {
        $(document).off('click');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.searchChannelResults != nextProps.searchChannelResults || 
            this.props.searchPlaylistResults != nextProps.searchPlaylistResults || 
            this.props.searchVideoResults != nextProps.searchVideoResults) {
                const resultsArray = [
                    {
                        title: 'Channels',
                        results: nextProps.searchChannelResults
                    },
                    {
                        title: 'Playlists',
                        results: nextProps.searchPlaylistResults
                    },
                    {
                        title: 'Videos',
                        results: nextProps.searchVideoResults
                    }
                ];
                this.setState({resultsArray: resultsArray});
        }
    }

    addContentFilter(searchResult) {
        this.setState({resultsArray: []});
        this.props.addFilter(searchResult);
    }

    onSearchFocus() {
        this.setState({isDropdownOpen: true});
        this.props.clearSearchResults();
        this.search('');
    }

    onSearchBlur() {
        this.setState({
            isDropdownOpen: false,
            resultsArray: []
        });
    }

    search(query) {
        const contentType = this.props.contentType;
        if (contentType == ContentTypes.CHANNELS || contentType == ContentTypes.ALL)
            this.props.actions.getSearchResults(query, 'channel');
        if (contentType == ContentTypes.PLAYLISTS || contentType == ContentTypes.ALL)
            this.props.actions.getSearchResults(query, 'playlist');
        if (contentType == ContentTypes.VIDEOS || contentType == ContentTypes.ALL)
            this.props.actions.getSearchResults(query, 'video');
    }

    computeResultValue(result) {
        return ''; // Don't want to display anything in the input box upon filter selection
    }

    onDownshiftChange(selectedItem) {
        this.addContentFilter(selectedItem);
    }

    onDownshiftStateChange(changes) {
        if (changes.type == '__autocomplete_change_input__') {
            this.search(changes.inputValue);
        }
    }

    render() {
        return (
            <div id="content-filter">
                <DownshiftSectioned
                    items={this.state.resultsArray}
                    itemToString={this.computeResultValue}
                    Result={FilterResult}
                    onFocus={this.onSearchFocus}
                    isOpen={this.state.isDropdownOpen}
                    onChange={this.onDownshiftChange}
                    onStateChange={this.onDownshiftStateChange}
                />
            </div>
        );
    }
}

ContentFilter.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    addFilter: PropTypes.func.isRequired,
    contentType: PropTypes.string.isRequired,
    searchChannelResults: PropTypes.array.isRequired,
    searchPlaylistResults: PropTypes.array.isRequired,
    searchVideoResults: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    clearSearchResults: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    return {
        searchChannelResults: state.searchChannelResults,
        searchPlaylistResults: state.searchPlaylistResults,
        searchVideoResults: state.searchVideoResults,
        isLoading: state.ajaxCallsInProgress.contentFilter > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(channelActions, dispatch),
        clearSearchResults: bindActionCreators(clearSearchResults, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.searchChannelResults !== next.searchChannelResults) || 
            (prev.searchPlaylistResults !== next.searchPlaylistResults) || 
            (prev.searchVideoResults !== next.searchVideoResults)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ContentFilter);