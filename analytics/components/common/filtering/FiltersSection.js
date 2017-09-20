import React from 'react';
import PropTypes from 'prop-types';
import ContentTypes from '../../../globals/ContentTypes';
import Periods from '../../../globals/Periods';
import addGraphFilter from '../../../helpers/addGraphFilter';
import removeGraphFilter from '../../../helpers/removeGraphFilter';
import filterArrayIncludes from '../../../helpers/filterArrayIncludes';
import ContentFilter from './ContentFilter';
import ContentTypeFilter from './ContentTypeFilter';
import TimePeriodFilter from './TimePeriodFilter';

class FiltersSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
        
        this.changeContentType = this.changeContentType.bind(this);
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.renderContentTypeFilter = this.renderContentTypeFilter.bind(this);
        this.renderAddedFilters = this.renderAddedFilters.bind(this);
        this.renderClearAllFilters = this.renderClearAllFilters.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state !== nextProps.state) {
            this.setState({...nextProps.state});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state !== nextState) {
            return true;
        }
        return false;
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

        const {timePeriod, dateRange, addedFilters} = this.state;
        this.props.onChangeFilters({
            contentType,
            timePeriod,
            dateRange,
            filters: newFiltersArray,
            addedFilters
        });
    }

    changeTimePeriod(timePeriod, dateRange) {
        if (timePeriod != this.state.timePeriod && timePeriod == Periods.CUSTOM) {
            this.setState({timePeriod: timePeriod});
            return;
        }

        const {contentType, filters, addedFilters} = this.state;
        this.props.onChangeFilters({
            contentType,
            timePeriod,
            dateRange,
            filters,
            addedFilters
        });
    }

    addFilter(searchResult) {
        const {newFiltersArray, newAddedFiltersArray, newContentType}
            = addGraphFilter(searchResult, this.state.filters, this.state.addedFilters);

        const {timePeriod, dateRange} = this.state;
        this.props.onChangeFilters({
            contentType: newContentType,
            timePeriod,
            dateRange,
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });
    }

    removeFilter(e) {
        let element = e.target;
        while (element.className.indexOf("added-filter") < 0) {
            element = element.parentNode;
        }
        const filterInfo = JSON.parse(element.children[0].value);

        const {newFiltersArray, newAddedFiltersArray, shouldClearContentTypeFilter}
            = removeGraphFilter(filterInfo, this.state.filters, this.state.addedFilters);
        
        let contentType = this.state.contentType;
        if (shouldClearContentTypeFilter) {
            contentType = ContentTypes.ALL;
        }

        const {timePeriod, dateRange} = this.state;
        this.props.onChangeFilters({
            contentType,
            timePeriod,
            dateRange,
            filters: newFiltersArray,
            addedFilters: newAddedFiltersArray
        });
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

        let contentType = this.state.contentType;
        if (shouldResetContentTypeFilter) {
            contentType = ContentTypes.ALL;
        }
        
        const {timePeriod, dateRange} = this.state;
        this.props.onChangeFilters({
            contentType,
            timePeriod,
            dateRange,
            filters: filtersArray,
            addedFilters: addedFiltersArray
        });
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
        return (
            <div id="filters-section">
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
            </div>
        );
    }
}

FiltersSection.propTypes = {
    state: PropTypes.object.isRequired,
    onChangeFilters: PropTypes.func.isRequired
};

export default FiltersSection;