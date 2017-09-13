import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import lineGraph from '../../graphs/lineGraph';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import addGraphFilter from '../../helpers/addGraphFilter';
import removeGraphFilter from '../../helpers/removeGraphFilter';
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
            contentType: ContentTypes.ALL,
            timePeriod: Periods.TWENTY_EIGHT_DAY,
            startEndDates: null,
            filters: [],
            addedFilters: []
        };
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
        this.changeContentType = this.changeContentType.bind(this);
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.renderContentTypeFilter = this.renderContentTypeFilter.bind(this);
        this.renderAddedFilters = this.renderAddedFilters.bind(this);
        this.renderClearAllFilters = this.renderClearAllFilters.bind(this);
    }

    componentWillMount() {
        const {timePeriod, startEndDates} = this.state;
        const filters = formatFiltersString(this.state.filters);
        this.props.actions.getViews(timePeriod, startEndDates, filters);
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
        let playlistFilter = {key: 'isCurated', value: '1'};
        let newFiltersArray = Object.assign([], this.state.filters);
        if (contentType == ContentTypes.PLAYLISTS) {
            if (!filterArrayIncludes(this.state.filters, playlistFilter)) {
                newFiltersArray.push(playlistFilter);
            }
        } else {
            contentType = ContentTypes.ALL;
            if (filterArrayIncludes(this.state.filters, playlistFilter)) {
                for (let i = 0; i < newFiltersArray.length; i++) {
                    if (newFiltersArray[i].key == 'isCurated') {
                        newFiltersArray.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.setState({
            contentType: contentType,
            filters: newFiltersArray
        });

        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getViews(timePeriod, startEndDates, formatFiltersString(newFiltersArray));
    }

    changeTimePeriod(timePeriod, startEndDates) {
        const filters = this.state.filters;
        if (timePeriod != this.state.timePeriod) {
            this.setState({
                timePeriod: timePeriod,
                startEndDates: startEndDates
            });
            if (timePeriod == Periods.CUSTOM) return;
        } else if (timePeriod == Periods.CUSTOM) {
            this.setState({startEndDates: startEndDates});
        }
        this.props.actions.getViews(timePeriod, startEndDates, formatFiltersString(filters));
    }

    addFilter(searchResult) {
        const {newFiltersArray, newAddedFiltersArray, newContentType}
            = addGraphFilter(searchResult, this.state.filters, this.state.addedFilters);

        this.setState({
            contentType: newContentType,
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });

        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getViews(timePeriod, startEndDates, formatFiltersString(newFiltersArray));
    }

    removeFilter(e) {
        let element = e.target;
        while (element.className.indexOf("added-filter") < 0) {
            element = element.parentNode;
        }
        const filterInfo = JSON.parse(element.children[0].value);

        const {newFiltersArray, newAddedFiltersArray, shouldClearContentTypeFilter}
            = removeGraphFilter(filterInfo, this.state.filters, this.state.addedFilters);
        
        this.setState({
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });
        if (shouldClearContentTypeFilter) {
            this.setState({contentType: ContentTypes.ALL});
        }

        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getViews(timePeriod, startEndDates, formatFiltersString(newFiltersArray));
    }

    clearFilters() {
        let addedFiltersArray = Object.assign([], this.state.addedFilters);
        let filtersArray = [];
        let shouldResetContentTypeFilter = false;

        while (addedFiltersArray.length > 0) {
            const {newFiltersArray, newAddedFiltersArray, shouldClearContentTypeFilter}
                = removeGraphFilter(addedFiltersArray[0], this.state.filters, addedFiltersArray);
            addedFiltersArray = newAddedFiltersArray;
            filtersArray = newFiltersArray;
            shouldResetContentTypeFilter = shouldClearContentTypeFilter;
        }

        this.setState({
            filters: filtersArray,
            addedFilters: addedFiltersArray
        });
        if (shouldResetContentTypeFilter) {
            this.setState({contentType: ContentTypes.ALL});
        }
        
        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getViews(timePeriod, startEndDates, formatFiltersString(filtersArray));
    }

    renderContentTypeFilter() {
        const contentType = this.state.contentType;
        const filtersArray = this.state.filters;
        if (contentType != ContentTypes.ALL) {
            if (contentType == ContentTypes.CHANNELS)
                return;
            for (let i = 0; i < filtersArray.length; i++) {
                if (filtersArray[i].key == 'video' || filtersArray[i].key == 'playlist')
                    return;
            }
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

    renderClearAllFilters() {
        if (this.state.addedFilters.length > 0) {
            return <button id="clear-all-filters" onClick={this.clearFilters}>Clear All Filters</button>;
        }
        return;
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);

        return (
            <div id="views-page">
                <h2>Views</h2>
                <div id="filters">
                    <ContentFilter
                        addFilter={this.addFilter}
                        contentType={this.state.contentType}
                    />
                    {this.renderContentTypeFilter()}
                    <TimePeriodFilter
                        changeTimePeriod={this.changeTimePeriod}
                        timePeriod={this.state.timePeriod}
                    />
                </div>
                <div id="added-filters">
                    {this.renderAddedFilters()}
                    {this.renderClearAllFilters()}
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