const computeWatchTimes = viewsAndAverageDuration => {
    let watchTimes = Object.assign({}, viewsAndAverageDuration);

    const columns = watchTimes.columnHeaders.map(item => {
        return item.name;
    });
    const viewsIndex = columns.indexOf('views');
    const averageViewDurationIndex = columns.indexOf('averageViewDuration');

    let watchTimeRows = Object.assign([], viewsAndAverageDuration.rows);
    watchTimeRows.forEach(row => {
        const minutesWatchedInSeconds = row[viewsIndex] * row[averageViewDurationIndex];
        row.push(minutesWatchedInSeconds / 60); // Times should be in minutes
    });

    const watchTimeColumnHeader = {name: 'watchTime', columnType: 'METRIC', dataType: 'DECIMAL'};
    watchTimes.columnHeaders.push(watchTimeColumnHeader);
    
    return watchTimes;
};

export default computeWatchTimes;