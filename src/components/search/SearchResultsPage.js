import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as channelActions from '../../actions/channelActions';
import * as videoActions from '../../actions/videoActions';
import * as videoTypes from '../../reducers/videoTypes';
import clearStore from '../../actions/clearAction';
import PlaylistResult from '../playlist/PlaylistResult';
import VideoResult from '../video/VideoResult';

export class SearchResultsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            rawResults: props.results,
            videoIndices: [],
            isLoading: true
        };
        this.getVideos = this.getVideos.bind(this);
        this.loadMoreResults = this.loadMoreResults.bind(this);
    }

    componentWillMount() {
        this.props.actions.getSearchResults(this.props.query);
    }

    componentDidMount() {
        document.title = "Search Results for: " + this.props.query;
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.query != nextProps.query) {
            this.setState({
                results: [],
                rawResults: [],
                videoIndices: [],
                isLoading: true
            });
            this.props.clearStore();
            this.props.actions.getSearchResults(nextProps.query);

            document.title = "Search Results for: " + nextProps.query;
            window.scrollTo(0, 0);
        }

        if (this.state.isLoading && !nextProps.isLoading) {
            let newResults = Object.assign([], this.state.rawResults);
            this.state.videoIndices.forEach((index, i) => {
                newResults[index] = nextProps.videoList[i];
            });
            this.setState({
                results: this.state.results.concat(newResults.slice(this.state.results.length)),
                isLoading: false
            });
        }

        if (JSON.stringify(this.props.results) != JSON.stringify(nextProps.results)) {
            this.getVideos(nextProps);
        }
    }

    componentWillUnmount() {
        this.props.clearStore();
    }

    getVideos(props) {
        this.setState({isLoading: true});

        let videoIds = [];
        let videoIndices = [];
        for (let i = this.state.results.length; i < props.results.length; i++) {
            const result = props.results[i];
            if (result.id.kind == 'youtube#video') {
                videoIds.push(result.id.videoId);
                videoIndices.push(i);
            }
        }
        this.setState({
            rawResults: props.results,
            videoIndices: videoIndices
        });

        const videoIdString = videoIds.join(',');
        this.props.actions.getVideo(videoIdString, videoTypes.QUEUED);
    }

    loadMoreResults() {
        this.setState({isLoading: true});
        const nextPageToken = this.props.pageToken.nextPageToken;
        const query = this.props.query;
        this.props.actions.getNextResults(query, nextPageToken);
    }

    renderResults() {
        if (this.props.resultsCount > 0) {
            const results = this.state.results;

            return (
                <div className="search-list">
                    {results.map((result, i) => {
                        if (result.kind == 'youtube#video') {
                            return (
                                <VideoResult video={result} key={result.id}/>
                            );
                        } else if (result.id.kind == 'youtube#playlist') {
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

    renderContent() {
        const pageTitle = 'Search results for: ';
        const isResults = this.props.resultsCount > 0;
        let resultsFound = 'no-results';
        if (isResults) {
            resultsFound = 'results-found';
        }

        return (
            <div>
                <h3>
                    <span>{pageTitle}</span>
                    <span className={resultsFound}>{this.props.query}</span>
                </h3>
                <h4>Results found: {this.props.resultsCount}</h4>
                {this.renderResults()}
            </div>
        );
    }

    render() {
        const loadingSpinner = require('../../images/loading.gif');
        if (this.props.isLoading) return (
            <div>
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );

        let hiddenClass = 'hidden';
        if (this.state.isLoading) {
            hiddenClass = '';
        }
        
        return (
            <div className="search-results">
                {this.renderContent()}
                <img className={`loading-spinner ${hiddenClass}`} src={loadingSpinner} alt="Loading..." />
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
    videoList: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    clearStore: PropTypes.func.isRequired,
    match: PropTypes.object
};

export function mapStateToProps(state, ownProps) {
    return {
        pageToken: state.searchPageToken,
        query: ownProps.match.params.q,
        results: state.searchResults,
        resultsCount: state.searchInfo.totalResults,
        videoList: state.video.queued,
        isLoading: state.ajaxCallsInProgress.searchResults > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, videoActions, channelActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearStore: bindActionCreators(clearStore, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !( // Only want to render if the condition below is true. (Returning false causes a re-render.)
            (!next.isLoading) ||
            (prev.pageToken !== next.pageToken) ||
            (prev.results !== next.results) ||
            (prev.videoList !== next.videoList) ||
            (prev.query != next.query)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(SearchResultsPage);