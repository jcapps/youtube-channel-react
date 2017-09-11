import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import lineGraph from '../../graphs/lineGraph';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import filterArrayIncludes from '../../helpers/filterArrayIncludes';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as viewsActions from '../../actions/viewsActions';
import ContentFilter from './ContentFilter';
import ContentTypeFilter from './ContentTypeFilter';
import TimePeriodFilter from './TimePeriodFilter';

export class ViewsPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            contentType: ContentTypes.VIDEOS,
            timePeriod: Periods.TWENTY_EIGHT_DAY,
            filters: [],
            addedFilters: []
        };
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
        this.changeContentType = this.changeContentType.bind(this);
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.renderContentTypeFilter = this.renderContentTypeFilter.bind(this);
        this.renderAddedFilters = this.renderAddedFilters.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }

    componentWillMount() {
        const timePeriod = this.state.timePeriod;
        const filters = formatFiltersString(this.state.filters);
        this.props.actions.getViews(timePeriod, null, filters);
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

    changeContentType(contentType) {
        let newFilter = null;
        if (contentType == ContentTypes.PLAYLISTS)
            newFilter = {key: 'isCurated', value: '1'};

        let newFiltersArray = Object.assign([], this.state.filters);
        if (newFilter && !filterArrayIncludes(this.state.filters, newFilter)) {
            newFiltersArray.push(newFilter);
        }
        this.setState({
            contentType: contentType,
            filters: newFiltersArray
        });

        const timePeriod = this.state.timePeriod;
        this.props.actions.getViews(timePeriod, null, formatFiltersString(newFiltersArray));
    }

    changeTimePeriod(timePeriod, startEndDates) {
        const filters = this.state.filters;
        if (timePeriod != this.state.timePeriod) {
            this.setState({timePeriod: timePeriod});
            if (timePeriod == Periods.CUSTOM) return;
        }
        this.props.actions.getViews(timePeriod, startEndDates, formatFiltersString(filters));
    }

    addFilter(searchResult) {
        const kind = searchResult.id.kind;

        let newFiltersArray = Object.assign([], this.state.filters);
        let newAddedFiltersArray = Object.assign([], this.state.addedFilters);
        newAddedFiltersArray.push(searchResult);

        if (kind == 'youtube#channel') {
            const newFilter = {key: 'channel', value: searchResult.id.channelId};
            if (!filterArrayIncludes(this.state.filters, newFilter)) {
                let containsChannelFilter = false;
                for (let i = 0; i < newFiltersArray.length; i++) {
                    if (newFiltersArray[i].key == 'channel') {
                        containsChannelFilter = true;
                        newFiltersArray[i].value.push(newFilter.value);
                        break;
                    }
                }
                if (!containsChannelFilter) {
                    const newFilterEntry = {key: newFilter.key, value: [newFilter.value]};
                    newFiltersArray.push(newFilterEntry);
                }
            }
        }
        if (kind == 'youtube#playlist') {
            const newFilter1 = {key: 'isCurated', value: '1'};
            const newFilter2 = {key: 'playlist', value: searchResult.id.playlistId};
            const newFilters = [newFilter1, newFilter2];
            newFilters.forEach((filter) => {
                if (!filterArrayIncludes(this.state.filters, filter)) {
                    if (filter.key == 'playlist') {
                        let containsPlaylistFilter = false;
                        for (let i = 0; i < newFiltersArray.length; i++) {
                            if (newFiltersArray[i].key == 'playlist') {
                                containsPlaylistFilter = true;
                                newFiltersArray[i].value.push(filter.value);
                                break;
                            }
                        }
                        if (!containsPlaylistFilter) {
                            const newFilterEntry = {key: filter.key, value: [filter.value]};
                            newFiltersArray.push(newFilterEntry);
                        }
                    } else {
                        newFiltersArray.push(filter);
                    }
                }
            });
        }
        if (kind == 'youtube#video') {
            const newFilter = {key: 'video', value: searchResult.id.videoId};
            if (!filterArrayIncludes(this.state.filters, newFilter)) {
                let containsVideoFilter = false;
                for (let i = 0; i < newFiltersArray.length; i++) {
                    if (newFiltersArray[i].key == 'video') {
                        containsVideoFilter = true;
                        newFiltersArray[i].value.push(newFilter.value);
                        break;
                    }
                }
                if (!containsVideoFilter) {
                    const newFilterEntry = {key: newFilter.key, value: [newFilter.value]};
                    newFiltersArray.push(newFilterEntry);
                }
            }
        }

        this.setState({
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });

        const timePeriod = this.state.timePeriod;
        this.props.actions.getViews(timePeriod, null, formatFiltersString(newFiltersArray));
    }

    removeFilter(e) {
        let element = e.target;
        while (element.className.indexOf("added-filter") < 0) {
            element = element.parentNode;
        }
        const filterInfo = JSON.parse(element.children[0].value);
        const kind = filterInfo.id.kind;

        let newFiltersArray = Object.assign([], this.state.filters);
        let newAddedFiltersArray = Object.assign([], this.state.addedFilters);

        for (let i = 0; i < newAddedFiltersArray.length; i++) {
            if (newAddedFiltersArray[i].etag == filterInfo.etag) {
                newAddedFiltersArray.splice(i, 1);
                break;
            }
        }

        if (kind == 'youtube#channel') {
            for (let i = 0; i < newFiltersArray.length; i++) {
                if (newFiltersArray[i].key == 'channel') {
                    for (let j = 0; j < newFiltersArray[i].value.length; j++) {
                        if (newFiltersArray[i].value[j] == filterInfo.id.channelId) {
                            newFiltersArray[i].value.splice(j, 1);
                            if (newFiltersArray[i].value.length == 0)
                                newFiltersArray.splice(i, 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if (kind == 'youtube#playlist') {
            for (let i = 0; i < newFiltersArray.length; i++) {
                if (newFiltersArray[i].key == 'playlist') {
                    for (let j = 0; j < newFiltersArray[i].value.length; j++) {
                        if (newFiltersArray[i].value[j] == filterInfo.id.playlistId) {
                            newFiltersArray[i].value.splice(j, 1);
                            if (newFiltersArray[i].value.length == 0) {
                                newFiltersArray.splice(i, 1);
                                for (let k = 0; k < newFiltersArray.length; k++) {
                                    if (newFiltersArray[k].key == 'isCurated') {
                                        newFiltersArray.splice(k, 1);
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if (kind == 'youtube#video') {
            for (let i = 0; i < newFiltersArray.length; i++) {
                if (newFiltersArray[i].key == 'video') {
                    for (let j = 0; j < newFiltersArray[i].value.length; j++) {
                        if (newFiltersArray[i].value[j] == filterInfo.id.videoId) {
                            newFiltersArray[i].value.splice(j, 1);
                            if (newFiltersArray[i].value.length == 0)
                                newFiltersArray.splice(i, 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        
        this.setState({
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });

        const timePeriod = this.state.timePeriod;
        this.props.actions.getViews(timePeriod, null, formatFiltersString(newFiltersArray));
    }

    renderContentTypeFilter() {
        const filtersArray = this.state.filters;
        for (let i = 0; i < filtersArray.length; i++) {
            if (filtersArray[i].key == 'video' || filtersArray[i].key == 'playlist')
                return;
        }
        return (
            <ContentTypeFilter
                changeContentType={this.changeContentType}
                contentType={this.state.contentType}
            />
        );
    }

    renderAddedFilters() {
        const filters = this.state.addedFilters;
        return filters.map((filter, i) => {
            return (
                <div key={i} className="added-filter" title={filter.snippet.title}>
                    <input className="hidden" value={JSON.stringify(filter)} readOnly="readOnly" />
                    <div className="added-filter-title">
                        {filter.snippet.title}
                    </div>
                    <button className="remove-filter" onClick={this.removeFilter}>×</button>
                </div>
            );
        });
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);

        return (
            <div id="views-page">
                <h2>Views</h2>
                <div id="filters">
                    <ContentFilter addFilter={this.addFilter}/>
                    {this.renderContentTypeFilter()}
                    <TimePeriodFilter
                        changeTimePeriod={this.changeTimePeriod}
                        timePeriod={this.state.timePeriod}
                    />
                </div>
                <div id="added-filters">
                    {this.renderAddedFilters()}
                </div>
                <div id="views-graph" />
            </div>
        );
    }
}

ViewsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    views: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        views: state.views,
        isLoading: state.ajaxCallsInProgress.views > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewsActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.views !== next.views)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ViewsPage);