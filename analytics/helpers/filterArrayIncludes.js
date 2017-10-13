const filterArrayIncludes = (filtersArray, filter) => {
    for (let i = 0; i < filtersArray.length; i++) {
        const filterItem = filtersArray[i];
        if (filterItem.key == filter.key && filterItem.value == filter.value)
            return true;
        if (filterItem.key == 'channel' || filterItem.key == 'playlist' || filterItem.key == 'video') {
            for (let j = 0; j < filterItem.value.length; j++) {
                if (filterItem.value[j] == filter.value)
                    return true;
            }
        }
        if (filterItem.key == 'country' && filter.key == 'country') {
            return true;
        }
    }
    return false;
};

export default filterArrayIncludes;