import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import getAllCountries from '../../../helpers/getAllCountries';
import DownshiftSectioned from './DownshiftSectioned';
import GeoFilterResult from './GeoFilterResult';

class GeoFilter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownOpen: false,
            resultsArray: []
        };
        this.addGeoFilter = this.addGeoFilter.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
        this.search = this.search.bind(this);
        this.computeResultValue = this.computeResultValue.bind(this);
        this.onDownshiftChange = this.onDownshiftChange.bind(this);
        this.onDownshiftStateChange = this.onDownshiftStateChange.bind(this);
    }

    componentDidMount() {
        $(document).click(e => {
            if (!$(e.target).closest('#geo-filter').length) {
                this.onSearchBlur();
            }
        });
    }

    componentWillUnmount() {
        $(document).off('click');
    }

    addGeoFilter(searchResult) {
        this.setState({resultsArray: []});
        this.props.addFilter(searchResult);
    }

    onSearchFocus() {
        this.setState({isDropdownOpen: true});
        this.search('');
    }

    onSearchBlur() {
        this.setState({
            isDropdownOpen: false,
            resultsArray: []
        });
    }

    search(query) {
        const countries = getAllCountries();
        const regionsArray = [];
        query = query.toUpperCase();
        if (query == '') {
            const suggestedCountries = [
                'United States',
                'United Kingdom',
                'Germany',
                'France',
                'Canada'
            ];
            for (let suggestedCountry of suggestedCountries) {
                for (let country of countries) {
                    if (country.name.common == suggestedCountry) {
                        let newCountry = Object.assign({}, country);
                        regionsArray.push(newCountry);
                        break;
                    }
                }
            }
        } else {
            for (let country of countries) {
                if (
                    country.name.common.toUpperCase().indexOf(query) > -1 ||
                    country.name.official.toUpperCase().indexOf(query) > -1
                ) {
                    let newCountry = Object.assign({}, country);
                    regionsArray.push(newCountry);
                }
            }
        }

        const foundResultsArray = [
            {
                title: 'Countries',
                results: regionsArray
            }
        ]
        this.setState({resultsArray: Object.assign([], foundResultsArray)});
    }

    computeResultValue(result) {
        return ''; // Don't want to display anything in the input box upon filter selection
    }

    onDownshiftChange(selectedItem) {
        this.addGeoFilter(selectedItem);
    }

    onDownshiftStateChange(changes) {
        if (changes.type == '__autocomplete_change_input__') {
            this.search(changes.inputValue);
        }
    }

    render() {
        return (
            <div id="geo-filter">
                <DownshiftSectioned
                    items={this.state.resultsArray}
                    itemToString={this.computeResultValue}
                    placeholder="Search regions..."
                    Result={GeoFilterResult}
                    onFocus={this.onSearchFocus}
                    isOpen={this.state.isDropdownOpen}
                    onChange={this.onDownshiftChange}
                    onStateChange={this.onDownshiftStateChange}
                />
            </div>
        );
    }
}

GeoFilter.propTypes = {
    addFilter: PropTypes.func.isRequired
};

export default GeoFilter;