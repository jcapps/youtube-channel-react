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

export class ViewsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectType: Periods.TWENTY_EIGHT_DAY,
            filters: '',
            searchText: ''
        };
        this.changeSelectType = this.changeSelectType.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
        this.search = this.search.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
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

    search(e) {
        const query = e.target.value;
        this.setState({searchText: query});
        this.props.channelActions.getSearchResults(query, 'video');
    }

    addFilter(e) {
        let element = e.target;
        while (element.className.indexOf("search-result") < 0) {
            element = element.parentNode;
        }

        const kind = element.name;
        let filter = this.state.filters;
        if (kind == 'youtube#video') filter = 'video==' + element.id;
        if (kind == 'youtube#playlist') filter = 'isCurated==1;playlist==' + element.id;

        const selectType = this.state.selectType;
        this.setState({ filters: filter });
        this.props.viewsActions.getViews(selectType, null, filter);
    }

    renderLineGraphD3(viewsInfo) {
        const container = d3.select('#views-graph');
        if (!container._groups[0][0]) return;
        container.html('');
        lineGraph(container, viewsInfo, 'day', 'views');
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);
        return (
            <div id="views-page">
                <h2>Views</h2>
                <input
                    id="search-filter"
                    type="text"
                    value={this.state.searchText}
                    onChange={this.search} />
                <div>
                    {this.props.searchResults.map(result => {
                        const kind = result.id.kind;
                        let id = result.etag;
                        if (kind == 'youtube#video') id = result.id.videoId;
                        if (kind == 'youtube#playlist') id = result.id.playlistId;
                        return (
                            <a key={id} name={kind} id={id} className="search-result" onClick={this.addFilter}>
                                <div>{result.snippet.title}</div>
                            </a>
                        );
                    })}
                </div>
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
                <div id="views-graph" />
            </div>
        );
    }
}

ViewsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    searchResults: PropTypes.array,
    views: PropTypes.object.isRequired,
    channelActions: PropTypes.object.isRequired,
    viewsActions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        searchResults: state.searchResults,
        views: state.views,
        isLoading: state.ajaxCallsInProgress.views > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        viewsActions: bindActionCreators(viewsActions, dispatch),
        channelActions: bindActionCreators(channelActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.views !== next.views) || 
            (prev.searchResults !== next.searchResults)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ViewsPage);