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
 * Get an analytics report given startDate, endDate, and metrics
 */
export function getReport(startDate, endDate, metrics) {
    return YouTubeAnalyticsApi.getReport(startDate, endDate, metrics).then(report => {
        return report;
    }).catch(error => {
        throw(error);
    });
}