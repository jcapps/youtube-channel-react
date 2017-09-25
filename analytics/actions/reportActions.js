import {bindActionCreators} from 'redux';
import getDateRange from '../helpers/getDateRange';
import zeroMissingData from '../helpers/zeroMissingData';
import * as analyticsActions from './analyticsActions';
import * as loginActions from './loginActions';

export function compileReport(searchTerms) {
    return function(dispatch, getState) {
        let {
            period,
            dateRange,
            metrics,
            filters,
            dimensions
        } = searchTerms;

        if (!dateRange) {
            const channelInfo = getState().channelInfo;
            let channelBirthdate = '';
            if (channelInfo.snippet) channelBirthdate = channelInfo.snippet.publishedAt;
            dateRange = getDateRange(period, channelBirthdate);
        }
        const {startDate, endDate} = dateRange;

        const helperLoginActions = bindActionCreators(loginActions, dispatch);

        return helperLoginActions.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
                return analyticsActions.getReport(startDate, endDate, metrics, dimensions, filters).then(report => {
                    if (!dimensions) return report; // i.e. if getting Total Stats
                    const reportData = zeroMissingData(report, startDate, endDate);
                    return reportData;
                }).catch(error => {
                    throw(error);
                });
            } else {
                throw(error);
            }
        });
    };
}