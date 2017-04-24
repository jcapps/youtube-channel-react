import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as channelActions from '../../actions/channelActions';
import PlaylistResult from '../playlist/PlaylistResult';
import VideoResult from '../video/VideoResult';

export class SearchResultsPage extends React.Component {
    constructor() {
        super();
        this.loadMoreResults = this.loadMoreResults.bind(this);
    }

    componentWillMount() {
        this.props.actions.getSearchResults(this.props.query);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.query != nextProps.params.q) {
            this.props.actions.getSearchResults(nextProps.params.q);
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
                        const videoId = result.id.videoId;
                        const playlistId = result.id.playlistId;
                        if (videoId) {
                            return (
                                <Link to={"/watch/" + videoId} key={videoId}>
                                    <VideoResult videoId={videoId}/>
                                </Link>
                            );
                        }
                        if (playlistId) {
                            return (
                                <Link to={"/playlist/" + playlistId} key={playlistId}>
                                    <PlaylistResult playlist={result}/>
                                </Link>
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
    pageToken: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    resultsCount: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        pageToken: state.searchPageToken,
        query: ownProps.params.q,
        results: state.searchResults,
        resultsCount: state.searchInfo.totalResults
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(channelActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPage);