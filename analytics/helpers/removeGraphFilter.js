const removeGraphFilter = (filterInfo, filtersArray, addedFiltersArray) => {
    let newFiltersArray = Object.assign([], filtersArray);
    let newAddedFiltersArray = Object.assign([], addedFiltersArray);

    for (let i = 0; i < newAddedFiltersArray.length; i++) {
        if (newAddedFiltersArray[i].etag == filterInfo.etag) {
            newAddedFiltersArray.splice(i, 1);
            break;
        }
    }

    let filterKey = '';
    let itemId = '';
    let shouldClearContentTypeFilter = false;
    const kind = filterInfo.id.kind;
    
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
    if (kind == 'youtube#channel' || kind == 'youtube#playlist' || kind == 'youtube#video') {
        for (let i = 0; i < newFiltersArray.length; i++) {
            if (newFiltersArray[i].key == filterKey) {
                for (let j = 0; j < newFiltersArray[i].value.length; j++) {
                    if (newFiltersArray[i].value[j] == itemId) {
                        newFiltersArray[i].value.splice(j, 1);
                        if (newFiltersArray[i].value.length == 0) {
                            shouldClearContentTypeFilter = true;
                            newFiltersArray.splice(i, 1);
                            if (kind != 'youtube#video') {
                                for (let k = 0; k < newFiltersArray.length; k++) {
                                    if (newFiltersArray[k].key == 'isCurated') {
                                        newFiltersArray.splice(k, 1);
                                        break;
                                    }
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

    return {newFiltersArray, newAddedFiltersArray, shouldClearContentTypeFilter};
}

export default removeGraphFilter;