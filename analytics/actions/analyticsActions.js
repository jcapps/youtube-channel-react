import YouTubeAnalyticsApi from '../api/YouTubeAnalyticsApi';

/**
 * Login to Analytics API
 */
export function login() {
    return YouTubeAnalyticsApi.login().then(isLoggedIn => {
        return isLoggedIn;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Check the user's login status
 */
export function isLoggedIn() {
    return YouTubeAnalyticsApi.isLoggedIn().then(isLoggedIn => {
        return isLoggedIn;
    }).catch(error => {
        throw(error);
    });
}

/**
 * Get an analytics report given startDate, endDate, metrics, dimensions, filters, sort, and maxResults
 */
export function getReport(startDate, endDate, metrics, dimensions = null, filters = '', sort = null, maxResults = null) {
    return YouTubeAnalyticsApi.getReport(startDate, endDate, metrics, dimensions, filters, sort, maxResults).then(report => {
        return report;
    }).catch(error => {
        throw(error);
    });
}