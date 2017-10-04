import Metrics from '../globals/Metrics';

const calculateRedSeconds = (row, columns) => {
    const averageViewDurationIndex = columns.indexOf(Metrics.AVERAGE_VIEW_DURATION.metric);
    const viewsIndex = columns.indexOf(Metrics.VIEWS.metric);
    const redViewsIndex = columns.indexOf(Metrics.YOUTUBE_RED_VIEWS.metric);
    const estimatedMinutesWatchedIndex = columns.indexOf(Metrics.WATCH_TIME.metric);
    const estimatedRedMinutesWatchedIndex = columns.indexOf(Metrics.YOUTUBE_RED_WATCH_TIME.metric);

    const averageViewDuration = row[averageViewDurationIndex];
    const views = row[viewsIndex];
    const redViews = row[redViewsIndex];
    const estimatedMinutesWatched = row[estimatedMinutesWatchedIndex];
    const estimatedRedMinutesWatched = row[estimatedRedMinutesWatchedIndex];

    if (estimatedMinutesWatched == 0) {
        return 0;
    }

    const errorMarginInSeconds = (averageViewDuration * views) - (estimatedMinutesWatched * 60);
    const redSecondsAdjusted = (redViews / views) * errorMarginInSeconds;
    let redSeconds = (estimatedRedMinutesWatched * 60) + redSecondsAdjusted;
    if (redSeconds < 0) redSeconds = 0;

    return Math.round(redSeconds);
};

const computeWatchTimes = viewsAndAverageDuration => {
    let watchTimes = Object.assign({}, viewsAndAverageDuration);
    let watchTimeRows = Object.assign([], viewsAndAverageDuration.rows);
    let watchTimeColumnHeaders = Object.assign([], viewsAndAverageDuration.columnHeaders);

    const columns = watchTimeColumnHeaders.map(item => {
        return item.name;
    });
    const viewsIndex = columns.indexOf(Metrics.VIEWS.metric);
    const averageViewDurationIndex = columns.indexOf(Metrics.AVERAGE_VIEW_DURATION.metric);

    let newWatchTimeRows = [];
    watchTimeRows.forEach(row => {
        const newRow = Object.assign([], row);
        const minutesWatchedInSeconds = row[viewsIndex] * row[averageViewDurationIndex];
        newRow.push(minutesWatchedInSeconds / 60); // Times should be in minutes
        const redMinutesWatchedInSeconds = calculateRedSeconds(row, columns);
        newRow.push(redMinutesWatchedInSeconds / 60); // Times should be in minutes
        newWatchTimeRows.push(newRow);
    });

    const watchTimeColumnHeader = {name: Metrics.WATCH_TIME.name, columnType: 'METRIC', dataType: 'DECIMAL'};
    const redWatchTimeColumnHeader = {name: Metrics.YOUTUBE_RED_WATCH_TIME.name, columnType: 'METRIC', dataType: 'DECIMAL'};
    watchTimeColumnHeaders.push(watchTimeColumnHeader);
    watchTimeColumnHeaders.push(redWatchTimeColumnHeader);
    
    watchTimes.columnHeaders = watchTimeColumnHeaders;
    watchTimes.rows = newWatchTimeRows;
    
    return watchTimes;
};

export default computeWatchTimes;