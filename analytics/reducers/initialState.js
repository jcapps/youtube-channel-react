import ContentTypes from '../globals/ContentTypes';
import Periods from '../globals/Periods';

export default {
    channelInfo: {},
    report: {},
    searchChannelResults: [],
    searchPlaylistResults: [],
    searchVideoResults: [],
    totalStats: {},
    isAuthenticated: false,
    error: {},
    filterState: {
        contentType: ContentTypes.ALL,
        timePeriod: Periods.TWENTY_EIGHT_DAY,
        dateRange: null,
        filters: [],
        addedFilters: []
    },
    ajaxCallsInProgress: {
        channel: 0,
        contentFilter: 0,
        isLoggedIn: 0,
        login: 0,
        report: 0,
        totalStats: 0
    }
};