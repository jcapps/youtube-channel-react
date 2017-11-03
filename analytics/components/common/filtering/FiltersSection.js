import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import ContentTypes from '../../../globals/ContentTypes';
import Periods from '../../../globals/Periods';
import addGraphFilter from '../../../helpers/addGraphFilter';
import removeGraphFilter from '../../../helpers/removeGraphFilter';
import filterArrayIncludes from '../../../helpers/filterArrayIncludes';
import ContentFilter from './ContentFilter';
import ContentTypeFilter from './ContentTypeFilter';
import GeoFilter from './GeoFilter';
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

    componentDidMount() {
        this.renderFlag();
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
    
    componentDidUpdate() {
        this.renderFlag();
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
            = addGraphFilter(searchResult, this.state.contentType, this.state.filters, this.state.addedFilters);

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

        const {newFiltersArray, newAddedFiltersArray}
            = removeGraphFilter(filterInfo, this.state.filters, this.state.addedFilters);
        
        let {contentType, timePeriod, dateRange} = this.state;
        if (newAddedFiltersArray.length == 0 && contentType == ContentTypes.VIDEOS) {
            contentType = ContentTypes.ALL;
        }

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
        let filtersArray = Object.assign([], this.state.filters);

        while (addedFiltersArray.length > 0) {
            const {newFiltersArray, newAddedFiltersArray}
                = removeGraphFilter(addedFiltersArray[0], filtersArray, addedFiltersArray);
            addedFiltersArray = newAddedFiltersArray;
            filtersArray = newFiltersArray;
        }

        let {contentType, timePeriod, dateRange} = this.state;
        if (addedFiltersArray.length == 0 && contentType == ContentTypes.VIDEOS) {
            contentType = ContentTypes.ALL;
        }

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

    renderFlag() {
        const div = this.refs.flag;
        if (!div) return;
        if (div.children.length > 0) {
            div.innerHTML = '';
        }

        const countryObject = JSON.parse($(div).closest('div.added-filter').find('input').val());

        const iso = countryObject.cca3.toLowerCase();
        const flagHtmlString = require(`world-countries/data/${iso}.svg`);
        const nodes = $.parseHTML(flagHtmlString);
        let flagSvg;
        for (let node of nodes) {
            if (node.tagName && node.tagName == 'svg') {
                flagSvg = node;
                break;
            }
        }

        if (!flagSvg.getAttribute('viewBox')) {
            const currentHeight = flagSvg.getAttribute('height');
            const currentWidth = flagSvg.getAttribute('width');
            flagSvg.setAttribute('viewBox', `0 0 ${currentWidth} ${currentHeight}`);
        }
        flagSvg.setAttribute('height', '20');
        flagSvg.setAttribute('width', '35.5');

        div.appendChild(flagSvg);
    }

    renderAddedFilters() {
        const filters = this.state.addedFilters;
        return filters.map((filter, i) => {
            let displayName = '';
            let flagContainer = '';
            if (filter.snippet) {
                displayName = <div className="filter-title-text"><span>{filter.snippet.title}</span></div>;
            } else {
                displayName = <div className="filter-title-text"><span>{filter.name.common}</span></div>;
                flagContainer = <div ref="flag" className="country-flag"/>;
            }

            return (
                <div key={i} className="added-filter" title={displayName}>
                    <input className="hidden" value={JSON.stringify(filter)} readOnly="readOnly" />
                    <div className="added-filter-title">
                        {flagContainer}
                        {displayName}
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
                    <GeoFilter addFilter={this.addFilter}/>
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