// Expects array of filters where a filter is of the form: {key: 'A', value: 'B'}
const formatFiltersString = filtersArray => {
    let filterString = '';
    filtersArray.forEach(filter => {
        if (filter.key == 'channel' || filter.key == 'playlist' || filter.key == 'video') {
            let filterValueString = '';
            for (let j = 0; j < filter.value.length; j++) {
                filterValueString += filter.value[j] + ','
            }
            filterValueString = filterValueString.slice(0, -1);
            filterString += filter.key + '==' + filterValueString + ';';
        } else {
            filterString += filter.key + '==' + filter.value + ';';
        }
    });
    return filterString;
};

export default formatFiltersString;