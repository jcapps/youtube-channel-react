import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as channelActions from '../../actions/channelActions';
import PlaylistResult from '../playlist/PlaylistResult';
import VideoResult from '../video/VideoResult';

export class SearchResultsPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
        this.loadMoreResults = this.loadMoreResults.bind(this);
    }

    componentWillMount() {
        this.props.actions.getSearchResults(this.props.query);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isLoading) {
            this.setState({ isLoading: false });
        }
    }

    loadMoreResults() {
        const nextPageToken = this.props.pageToken.nextPageToken;
        const query = this.props.query;
        this.props.actions.getNextResults(query, nextPageToken);
    }

    renderResults() {
        if (this.props.resultsCount > 0) {
            return (
                <div className="search-list">
                    {this.props.results.map(result => {
                        if (result.id.kind == 'youtube#video') {
                            return (
                                <VideoResult videoId={result.id.videoId} key={result.id.videoId}/>
                            );
                        }
                        if (result.id.kind == 'youtube#playlist') {
                            return (
                                <PlaylistResult playlist={result} key={result.id.playlistId}/>
                            );
                        }
                    })}
                    {this.renderViewMore()}
                </div>
            );
        }
    }

    renderViewMore() {
        if (this.props.pageToken.nextPageToken) {
            return (
                <a id="view-more" onClick={this.loadMoreResults}>
                    <div><b>View More</b></div>
                </a>
            );
        }
    }

    render() {
        if (this.state.isLoading) return <h3>Searching...</h3>;
        const pageTitle = 'Search results for: ';
        const isResults = this.props.resultsCount > 0;
        let resultsFound = 'no-results';
        if (isResults) {
            resultsFound = 'results-found';
        }
        return (
            <div className="search-results">
                <h3>
                    <span>{pageTitle}</span>
                    <span className={resultsFound}>{this.props.query}</span>
                </h3>
                <h4>Results found: {this.props.resultsCount}</h4>
                {this.renderResults()}
            </div>
        );
    }
}

SearchResultsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    pageToken: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    resultsCount: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        pageToken: state.searchPageToken,
        query: ownProps.match.params.q,
        results: state.searchResults,
        resultsCount: state.searchInfo.totalResults,
        isLoading: state.ajaxCallsInProgress.searchResults > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(channelActions, dispatch) };
}

const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return (prev.isLoading === next.isLoading || prev.pageToken === next.pageToken);
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(SearchResultsPage);