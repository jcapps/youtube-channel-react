const removeGraphFilter = (filterInfo, filtersArray, addedFiltersArray) => {
    let newFiltersArray = Object.assign([], filtersArray);
    let newAddedFiltersArray = Object.assign([], addedFiltersArray);

    let filterKey = '';
    let itemId = '';
    let kind = 'region#country';
    if (filterInfo.kind == 'youtube#searchResult') {
        kind = filterInfo.id.kind;

        if (kind == 'youtube#channel') {
            filterKey = 'channel';
            itemId = filterInfo.id.channelId;
        }
        if (kind == 'youtube#playlist') {
            filterKey = 'playlist';
            itemId = filterInfo.id.playlistId;
        }
        if (kind == 'youtube#video') {
            filterKey = 'video';
            itemId = filterInfo.id.videoId;
        }
    }
    else if (filterInfo.kind == 'youtube#playlist' || filterInfo.kind == 'youtube#video') {
        kind = filterInfo.kind;
        itemId = filterInfo.id;
        if (kind == 'youtube#playlist') {
            filterKey = 'playlist';
        } else {
            filterKey = 'video';
        }
    }

    for (let i = 0; i < newAddedFiltersArray.length; i++) {
        if (
            newAddedFiltersArray[i].etag == filterInfo.etag ||
            newAddedFiltersArray[i].cca2 && kind == 'region#country'
        ) {
            newAddedFiltersArray.splice(i, 1);
            break;
        }
    }

    if (kind == 'region#country') {
        filterKey = 'country';
        itemId = filterInfo.cca2;
    }
    if (
        kind == 'youtube#channel' || 
        kind == 'youtube#playlist' || 
        kind == 'youtube#video'
    ) {
        for (let i = 0; i < newFiltersArray.length; i++) {
            if (newFiltersArray[i].key == filterKey) {
                for (let j = 0; j < newFiltersArray[i].value.length; j++) {
                    if (newFiltersArray[i].value[j] == itemId) {
                        newFiltersArray[i].value.splice(j, 1);
                        if (newFiltersArray[i].value.length == 0) {
                            newFiltersArray.splice(i, 1);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
    if (kind == 'region#country') {
        for (let i = 0; i < newFiltersArray.length; i++) {
            if (newFiltersArray[i].key == filterKey) {
                newFiltersArray.splice(i, 1);
                break;
            }
        }
    }

    return {newFiltersArray, newAddedFiltersArray};
}

export default removeGraphFilter;