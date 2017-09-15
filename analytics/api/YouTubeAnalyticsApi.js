import axios from 'axios';
import toastr from 'toastr';

const CLIENT_ID = process.env.CLIENT_ID;
const KEY = process.env.YOUTUBE_KEY;

const googleClientApiUrl = 'https://apis.google.com/js/api.js';
const analyticsApiUrl = 'https://www.googleapis.com/youtube/analytics/v1/';
const reportsUrl = analyticsApiUrl + 'reports';
const analyticsScope = 'https://www.googleapis.com/auth/yt-analytics.readonly';
const analyticsDiscoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/youtubeAnalytics/v1/rest'];

class YouTubeAnalyticsApi {
    static login() {
        return new Promise((resolve, reject) => {
            let GoogleAuth;
            let gapiScript = document.createElement('script');
            gapiScript.id = 'gapiScript';
            gapiScript.src = googleClientApiUrl;
            gapiScript.onload = () => {
                /* eslint-disable no-undef */
                gapi.load('client:auth2', () => {
                    gapi.client.init({
                        'apiKey': KEY,
                        'clientId': CLIENT_ID,
                        'scope': analyticsScope,
                        'discoveryDocs': analyticsDiscoveryDocs
                    }).then(() => {
                        GoogleAuth = gapi.auth2.getAuthInstance();
                        GoogleAuth.signIn().then(() => {
                            const isLoggedIn = GoogleAuth.isSignedIn.get();
                            if (isLoggedIn) {
                                const tokenInfo = GoogleAuth.j8.$K.Q7;
                                localStorage.setItem('access_token', tokenInfo.access_token);
                                localStorage.setItem('expires_at', tokenInfo.expires_at)
                                toastr.success('Signed in!');
                            } else {
                                toastr.error('Unable to sign in.');
                            }
                            let scriptToRemove = document.getElementById('gapiScript');
                            scriptToRemove.parentNode.removeChild(scriptToRemove);
                            resolve(isLoggedIn);
                        });
                    });
                });
            };
            document.getElementsByTagName('head')[0].appendChild(gapiScript);
        });
    }

    static getAccessToken() {
        return localStorage.getItem('access_token');
    }

    static getExpiration() {
        return localStorage.getItem('expires_at');
    }

    static isAccessTokenValid() {
        const accessToken = this.getAccessToken();
        const expiresAt = this.getExpiration();
        const now = new Date();
        if (!accessToken || !expiresAt || expiresAt - now.getTime() <= 0) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(true);
        };
    }

    static isLoggedIn() {
        return this.isAccessTokenValid().then(isValid => {
            return isValid;
        });
    }

    static getReport(startDate, endDate, metrics, dimensions, filters) {
        const authHeader = {
            'Authorization': 'Bearer ' + this.getAccessToken()
        };
        const reportParams = {
            'ids': 'channel==MINE',
            'start-date': startDate,
            'end-date': endDate,
            'metrics': metrics,
            'dimensions': dimensions,
            'filters': filters
        };

        return new Promise((resolve, reject) => {
            axios.get(reportsUrl, {headers: authHeader, params: reportParams}).then(res => {
                resolve(res.data);
            });
        });
    }
}

export default YouTubeAnalyticsApi;