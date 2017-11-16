import ContentTypes from '../globals/ContentTypes';
import GraphTypes from '../globals/GraphTypes';
import Periods from '../globals/Periods';

export default {
    channelInfo: {},
    report: {},
    searchChannelResults: [],
    searchPlaylistResults: [],
    searchVideoResults: [],
    topResultsReport: {},
    totalStats: {},
    video: {},
    isAuthenticated: false,
    error: {},
    filterState: {
        contentType: ContentTypes.ALL,
        timePeriod: Periods.TWENTY_EIGHT_DAY,
        dateRange: null,
        filters: [],
        addedFilters: []
    },
    graphType: GraphTypes.LINE,
    ajaxCallsInProgress: {
        channel: 0,
        contentFilter: 0,
        isLoggedIn: 0,
        login: 0,
        report: 0,
        topResultsReport: 0,
        totalStats: 0,
        video: 0
    }
};