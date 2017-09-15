import formatDateString from './formatDateString';

const zeroMissingData = (report, start, end) => {
    const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

    let dataInfo = Object.assign({}, report);
    const startDate = Date.parse(start);
    const endDate = Date.parse(end);

    const columns = report.columnHeaders.map(item => {
        return item.name;
    });
    const dateColumn = columns.indexOf('day');

    let compareDate = startDate;
    if (!report.rows) { // When no rows because all data points are zero
        const timeDifference = endDate - startDate;
        const numDays = timeDifference / DAY_IN_MILLISECONDS;
        dataInfo.rows = new Array(numDays);
        for (let i = 0; i < numDays; i++) {
            compareDate += DAY_IN_MILLISECONDS;
            let compareDateString = formatDateString(new Date(compareDate));
            let newDataPoint = new Array(columns.length).fill(0);
            newDataPoint[dateColumn] = compareDateString;
            dataInfo.rows[i] = newDataPoint;
        }
    } else { // When some rows missing because data points are zero
        let data = Object.assign([], dataInfo.rows);
        for (let i = 0; i < dataInfo.rows.length; i++) {
            const rowDate = dataInfo.rows[i][dateColumn];
            compareDate += DAY_IN_MILLISECONDS;
            let compareDateString = formatDateString(new Date(compareDate));

            while (rowDate != compareDateString && compareDate < endDate) {
                let newDataPoint = new Array(columns.length).fill(0);
                newDataPoint[dateColumn] = compareDateString;
                const newIndex = data.indexOf(dataInfo.rows[i]);
                data.splice(newIndex, 0, newDataPoint);
                compareDate += DAY_IN_MILLISECONDS;
                compareDateString = formatDateString(new Date(compareDate));
            }
        }
        dataInfo.rows = data;
        
        // Zero any missing data at end of array
        compareDate += DAY_IN_MILLISECONDS;
        let compareDateString = formatDateString(new Date(compareDate));
        let endDateString = formatDateString(new Date(endDate));
        while (compareDateString != endDateString && compareDate < endDate) {
            let newDataPoint = new Array(columns.length).fill(0);
            newDataPoint[dateColumn] = compareDateString;
            dataInfo.rows.push(newDataPoint);
            compareDate += DAY_IN_MILLISECONDS;
            compareDateString = formatDateString(new Date(compareDate));
        }
    }

    return dataInfo;
};

export default zeroMissingData;