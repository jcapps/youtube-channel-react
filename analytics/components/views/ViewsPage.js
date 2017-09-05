import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import $ from 'jquery';
import lineGraph from '../../graphs/lineGraph';
import Periods from '../../globals/Periods';
import * as channelActions from '../../actions/channelActions';
import * as viewsActions from '../../actions/viewsActions';
import clearStore from '../../actions/clearAction';
import FilterResult from './FilterResult';

export class ViewsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectType: Periods.TWENTY_EIGHT_DAY,
            filters: '',
            searchText: ''
        };
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
        this.changeSelectType = this.changeSelectType.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
        this.updateSearchText = this.updateSearchText.bind(this);
        this.search = this.search.bind(this);
        this.addFilter = this.addFilter.bind(this);
    }

    componentWillMount() {
        const selectType = this.state.selectType;
        const filters = this.state.filters;
        this.props.viewsActions.getViews(selectType, null, filters);
    }

    componentDidMount() {
        document.title = "Analytics: Views";
        window.scrollTo(0, 0);
    }

    renderLineGraphD3(viewsInfo) {
        const container = d3.select('#views-graph');
        if (!container._groups[0][0]) return;
        container.html('');
        lineGraph(container, viewsInfo, 'day', 'views');
    }

    changeSelectType(e) {
        const selectType = e.target.value;
        this.setState({ selectType: selectType });

        if (selectType == Periods.CUSTOM) {
            $('#select-custom-range').removeClass('hidden');
        } else {
            $('#select-custom-range').addClass('hidden');
            const filters = this.state.filters;
            this.props.viewsActions.getViews(selectType, null, filters);
        }
    }

    setDateRange() {
        const startDate = $('#start-date').val();
        const endDate = $('#end-date').val();
        const selectType = this.state.selectType;
        const filters = this.state.filters;
        this.props.viewsActions.getViews(selectType, {startDate, endDate}, filters);
    }

    updateSearchText(e) {
        const query = e.target.value;
        this.setState({searchText: query});
    }

    search(e) {
        e.preventDefault();
        this.props.channelActions.getSearchResults(this.state.searchText, 'channel');
        this.props.channelActions.getSearchResults(this.state.searchText, 'playlist');
        this.props.channelActions.getSearchResults(this.state.searchText, 'video');
    }

    addFilter(e) {
        let element = e.target;
        while (element.className.indexOf("search-result") < 0) {
            element = element.parentNode;
        }
        const searchResult = JSON.parse(element.children[0].value);

        const kind = searchResult.id.kind;
        let newFilter = '';
        if (kind == 'youtube#video') newFilter = 'video==' + searchResult.id.videoId + ';';
        if (kind == 'youtube#playlist') newFilter = 'isCurated==1;playlist==' + searchResult.id.playlistId + ';';

        const {selectType, filters} = this.state;
        this.setState({ filters: newFilter });
        this.props.viewsActions.getViews(selectType, null, newFilter);
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);
        return (
            <div id="views-page">
                <h2>Views</h2>
                <div id="views-graph" />
                <select className="views-select" value={this.state.selectType} onChange={this.changeSelectType}>
                    <option value={Periods.SEVEN_DAY}>Last 7 Days</option>
                    <option value={Periods.TWENTY_EIGHT_DAY}>Last 28 Days</option>
                    <option value={Periods.THIRTY_DAY}>Last 30 Days</option>
                    <option value={Periods.YEAR}>Last 365 Days</option>
                    <option value={Periods.LIFETIME}>Lifetime</option>
                    <option value={Periods.CUSTOM}>Custom range...</option>
                </select>
                <div id="select-custom-range" className="hidden">
                    <input id="start-date" type="date" />
                    <input id="end-date" type="date" />
                    <button onClick={this.setDateRange}>Go</button>
                </div>
                <form onSubmit={this.search}>
                    <input
                        id="search-filter"
                        type="text"
                        value={this.state.searchText}
                        onChange={this.updateSearchText} />
                    <button type="submit">Search</button>
                </form>
                <div>
                    <p>Channels</p>
                    {this.props.searchChannelResults.map(result => {
                        const kind = result.id.kind;
                        const id = result.id.channelId;
                        return (
                            <a key={id} className="search-result" onClick={this.addFilter}>
                                <input className="hidden" value={JSON.stringify(result)} readOnly="readOnly" />
                                <FilterResult result={result}/>
                            </a>
                        );
                    })}
                    <p>Playlists</p>
                    {this.props.searchPlaylistResults.map(result => {
                        const kind = result.id.kind;
                        const id = result.id.playlistId;
                        return (
                            <a key={id} className="search-result" onClick={this.addFilter}>
                                <input className="hidden" value={JSON.stringify(result)} readOnly="readOnly" />
                                <FilterResult result={result}/>
                            </a>
                        );
                    })}
                    <p>Videos</p>
                    {this.props.searchVideoResults.map(result => {
                        const kind = result.id.kind;
                        const id = result.id.videoId;
                        return (
                            <a key={id} className="search-result" onClick={this.addFilter}>
                                <input className="hidden" value={JSON.stringify(result)} readOnly="readOnly" />
                                <FilterResult result={result}/>
                            </a>
                        );
                    })}
                </div>
                <div>
                </div>
            </div>
        );
    }
}

ViewsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    searchChannelResults: PropTypes.array,
    searchPlaylistResults: PropTypes.array,
    searchVideoResults: PropTypes.array,
    views: PropTypes.object.isRequired,
    channelActions: PropTypes.object.isRequired,
    viewsActions: PropTypes.object.isRequired,
    clearStore: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    return {
        searchChannelResults: state.searchChannelResults,
        searchPlaylistResults: state.searchPlaylistResults,
        searchVideoResults: state.searchVideoResults,
        views: state.views,
        isLoading: state.ajaxCallsInProgress.views > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        viewsActions: bindActionCreators(viewsActions, dispatch),
        channelActions: bindActionCreators(channelActions, dispatch),
        clearStore: bindActionCreators(clearStore, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.views !== next.views) || 
            (prev.searchChannelResults !== next.searchChannelResults) || 
            (prev.searchPlaylistResults !== next.searchPlaylistResults) || 
            (prev.searchVideoResults !== next.searchVideoResults)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ViewsPage);