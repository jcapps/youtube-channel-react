import ContentTypes from '../globals/ContentTypes';
import filterArrayIncludes from './filterArrayIncludes';

const addGraphFilter = (filterInfo, filtersArray, addedFiltersArray) => {
    let newFiltersArray = Object.assign([], filtersArray);
    let newAddedFiltersArray = Object.assign([], addedFiltersArray);

    newAddedFiltersArray.push(filterInfo);

    let filterKey = '';
    let itemId = '';
    let newContentType = ContentTypes.ALL;
    const kind = filterInfo.id.kind;

    if (kind == 'youtube#channel') {
        filterKey = 'channel';
        itemId = filterInfo.id.channelId;
        newContentType = ContentTypes.CHANNELS;
    }
    if (kind == 'youtube#playlist') {
        filterKey = 'playlist';
        itemId = filterInfo.id.playlistId;
        newContentType = ContentTypes.PLAYLISTS;
    }
    if (kind == 'youtube#video') {
        filterKey = 'video';
        itemId = filterInfo.id.videoId;
        newContentType = ContentTypes.VIDEOS;
    }
    if (kind == 'youtube#channel' || kind == 'youtube#playlist' || kind == 'youtube#video') {
        const newFilter = {key: filterKey, value: itemId};
        if (!filterArrayIncludes(filtersArray, newFilter)) {
            let containsFilter = false;
            for (let i = 0; i < newFiltersArray.length; i++) {
                if (newFiltersArray[i].key == filterKey) {
                    containsFilter = true;
                    newFiltersArray[i].value.push(newFilter.value);
                    break;
                }
            }
            if (!containsFilter) {
                const newFilterEntry = {key: newFilter.key, value: [newFilter.value]};
                newFiltersArray.push(newFilterEntry);
            }
        }
    }
    if (kind == 'youtube#playlist') {
        const newFilter = {key: 'isCurated', value: '1'};
        if (!filterArrayIncludes(filtersArray, newFilter)) {
            newFiltersArray.push(newFilter);
        }
    }

    return {newFiltersArray, newAddedFiltersArray, newContentType};
}

export default addGraphFilter;