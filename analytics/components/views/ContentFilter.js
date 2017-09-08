import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import * as channelActions from '../../actions/channelActions';
import clearStore from '../../actions/clearAction';
import DownshiftSectioned from '../common/DownshiftSectioned';
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
        this.setState({
            isDropdownOpen: false,
            resultsArray: []
        });
        this.props.addFilter(searchResult);
    }

    onSearchFocus() {
        this.setState({isDropdownOpen: true});
        this.search('');
    }

    onSearchBlur() {
        this.setState({
            isDropdownOpen: false,
            resultsArray: []
        });
    }

    search(query) {
        this.props.actions.getSearchResults(query, 'channel');
        this.props.actions.getSearchResults(query, 'playlist');
        this.props.actions.getSearchResults(query, 'video');
    }

    computeResultValue(result) {
        return (result && result.snippet) ? result.snippet.title : '';
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
    searchChannelResults: PropTypes.array,
    searchPlaylistResults: PropTypes.array,
    searchVideoResults: PropTypes.array,
    actions: PropTypes.object.isRequired,
    clearStore: PropTypes.func.isRequired
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
        clearStore: bindActionCreators(clearStore, dispatch)
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