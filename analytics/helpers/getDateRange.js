import Periods from '../globals/Periods';
import formatDateString from './formatDateString';

const getDateRange = (period, channelBirthdate) => {
    const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    const today = new Date();
    const todayString = formatDateString(today);
    const thisYear = today.getFullYear();

    switch(period) {
        case Periods.SEVEN_DAY:
            return {
                startDate: formatDateString(new Date(today.getTime() - DAY_IN_MILLISECONDS * 7)),
                endDate: todayString
            };
        case Periods.TWENTY_EIGHT_DAY:
            return {
                startDate: formatDateString(new Date(today.getTime() - DAY_IN_MILLISECONDS * 28)),
                endDate: todayString
            };
        case Periods.THIRTY_DAY:
            return {
                startDate: formatDateString(new Date(today.getTime() - DAY_IN_MILLISECONDS * 30)),
                endDate: todayString
            };
        case Periods.THIS_YEAR:
            return {
                startDate: formatDateString(new Date(thisYear, 0, 1)),
                endDate: todayString
            };
        case Periods.LAST_YEAR:
            return {
                startDate: formatDateString(new Date(thisYear - 1, 0, 1)),
                endDate: formatDateString(new Date(thisYear - 1, 11, 31))
            };
        case Periods.YEAR:
            return {
                startDate: formatDateString(new Date(today.getTime() - DAY_IN_MILLISECONDS * 365)),
                endDate: todayString
            };
        case Periods.LIFETIME:
            return {
                startDate: formatDateString(new Date(Date.parse(channelBirthdate))),
                endDate: todayString
            };
        default: 
            return {
                startDate: formatDateString(new Date(today.getTime() - DAY_IN_MILLISECONDS * 28)),
                endDate: todayString
            };
    }
};

export default getDateRange;