import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as analyticsActions from './analyticsActions';

export function getChannelAnalytics() {
    return function(dispatch) {
        const today = new Date();
        const startDate = formatDateString(new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365 * 4));
        const endDate = formatDateString(today);
        const metrics = 'views';
        return analyticsActions.getReport(startDate, endDate, metrics).then(report => {
            console.log(report);
        }).catch(error => {
            throw(error);
        });
    };
}

function formatDateString(date) {
    let yyyy = date.getFullYear().toString();
    let mm = padToTwoCharacters(date.getMonth() + 1);
    let dd = padToTwoCharacters(date.getDate());

    return yyyy + '-' + mm + '-' + dd;
}

function padToTwoCharacters(number) {
    if (number < 10) {
        return '0' + number;
    } else {
        return number.toString();
    }
}