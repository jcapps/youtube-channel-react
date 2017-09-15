const computeWatchTimes = viewsAndAverageDuration => {
    let watchTimes = Object.assign({}, viewsAndAverageDuration);
    let watchTimeRows = Object.assign([], viewsAndAverageDuration.rows);
    let watchTimeColumnHeaders = Object.assign([], viewsAndAverageDuration.columnHeaders);

    const columns = watchTimeColumnHeaders.map(item => {
        return item.name;
    });
    const viewsIndex = columns.indexOf('views');
    const averageViewDurationIndex = columns.indexOf('averageViewDuration');

    let newWatchTimeRows = [];
    watchTimeRows.forEach(row => {
        const newRow = Object.assign([], row);
        const minutesWatchedInSeconds = row[viewsIndex] * row[averageViewDurationIndex];
        newRow.push(minutesWatchedInSeconds / 60); // Times should be in minutes
        newWatchTimeRows.push(newRow);
    });

    const watchTimeColumnHeader = {name: 'watchTime', columnType: 'METRIC', dataType: 'DECIMAL'};
    watchTimeColumnHeaders.push(watchTimeColumnHeader);
    
    watchTimes.columnHeaders = watchTimeColumnHeaders;
    watchTimes.rows = newWatchTimeRows;
    
    return watchTimes;
};

export default computeWatchTimes;