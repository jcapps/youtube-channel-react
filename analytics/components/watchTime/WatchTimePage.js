import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import addGraphFilter from '../../helpers/addGraphFilter';
import removeGraphFilter from '../../helpers/removeGraphFilter';
import computeWatchTimes from '../../helpers/computeWatchTimes';
import filterArrayIncludes from '../../helpers/filterArrayIncludes';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as watchTimeActions from '../../actions/watchTimeActions';
import ContentFilter from '../common/filtering/ContentFilter';
import ContentTypeFilter from '../common/filtering/ContentTypeFilter';
import TimePeriodFilter from '../common/filtering/TimePeriodFilter';
import LineGraph from '../common/graphs/LineGraph';

export class WatchTimePage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            contentType: ContentTypes.ALL,
            timePeriod: Periods.TWENTY_EIGHT_DAY,
            startEndDates: null,
            filters: [],
            addedFilters: []
        };
        this.changeContentType = this.changeContentType.bind(this);
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.renderContentTypeFilter = this.renderContentTypeFilter.bind(this);
        this.renderAddedFilters = this.renderAddedFilters.bind(this);
        this.renderClearAllFilters = this.renderClearAllFilters.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        const {timePeriod, startEndDates} = this.state;
        const filters = formatFiltersString(this.state.filters);
        this.props.actions.getWatchTime(timePeriod, startEndDates, filters);
    }

    componentDidMount() {
        document.title = "Analytics: Watch Time";
        window.scrollTo(0, 0);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.props.isLoading != nextProps.isLoading ||
            this.props.watchTime !== nextProps.watchTime ||
            this.props.totalStats !== nextProps.totalStats ||
            (this.state.timePeriod !== nextState.timePeriod && nextState.timePeriod == Periods.CUSTOM)
        ) {
            return true;
        }
        return false;
    }

    showLoadingSpinner() {
        $('#watch-time-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#watch-time-page .loading-spinner').addClass('hidden');
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

        this.showLoadingSpinner();
        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getWatchTime(timePeriod, startEndDates, formatFiltersString(newFiltersArray));
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

        this.showLoadingSpinner();
        this.props.actions.getWatchTime(timePeriod, startEndDates, formatFiltersString(filters));
    }

    addFilter(searchResult) {
        const {newFiltersArray, newAddedFiltersArray, newContentType}
            = addGraphFilter(searchResult, this.state.filters, this.state.addedFilters);

        this.setState({
            contentType: newContentType,
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });

        this.showLoadingSpinner();
        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getWatchTime(timePeriod, startEndDates, formatFiltersString(newFiltersArray));
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

        this.showLoadingSpinner();
        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getWatchTime(timePeriod, startEndDates, formatFiltersString(newFiltersArray));
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
        
        this.showLoadingSpinner();
        const {timePeriod, startEndDates} = this.state;
        this.props.actions.getWatchTime(timePeriod, startEndDates, formatFiltersString(filtersArray));
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

    renderLineGraph() {
        if (!this.props.watchTime.columnHeaders) return <div/>;

        const watchTimeInfo = computeWatchTimes(this.props.watchTime);
        return (
            <LineGraph
                dataInfo={watchTimeInfo}
                xColumnName="day"
                yColumnName="watchTime"
                onRenderFinish={this.hideLoadingSpinner}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        let totalViews = 0;
        let totalEstimatedMinutesWatched = 0;
        const totalStats = this.props.totalStats;
        if (totalStats.columnHeaders) {
            const totalStatsColumns = totalStats.columnHeaders.map(item => {
                return item.name;
            });
            if (totalStats.rows) {
                totalViews = totalStats.rows[0][totalStatsColumns.indexOf('views')];
                totalEstimatedMinutesWatched = totalStats.rows[0][totalStatsColumns.indexOf('estimatedMinutesWatched')];
            } else {
                totalViews = 0;
                totalEstimatedMinutesWatched = 0;
            }
        }
        
        return (
            <div id="watch-time-page">
                <h2>Watch Time</h2>
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
                <h4>Total Views: {totalViews.toLocaleString()}</h4>
                <h4>Total Estimated Minutes Watched: {totalEstimatedMinutesWatched.toLocaleString()}</h4>
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

WatchTimePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    watchTime: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        watchTime: state.watchTime,
        totalStats: state.totalStats,
        isLoading: state.ajaxCallsInProgress.watchTime > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(watchTimeActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.watchTime !== next.watchTime) || 
            (prev.totalStats !== next.totalStats)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(WatchTimePage);