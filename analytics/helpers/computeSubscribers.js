import Metrics from '../globals/Metrics';

const computeSubscribers = (report) => {
    let subscribers = Object.assign({}, report);
    let subscribersRows = Object.assign([], report.rows);
    let subscribersColumnHeaders = Object.assign([], report.columnHeaders);

    const subscribersColumns = subscribersColumnHeaders.map(item => {
        return item.name;
    });
    const subscribersGainedIndex = subscribersColumns.indexOf(Metrics.SUBSCRIBERS_GAINED.metric);
    const subscribersLostIndex = subscribersColumns.indexOf(Metrics.SUBSCRIBERS_LOST.metric);

    let newSubscribersRows = [];
    for (let i = 0; i < subscribersRows.length; i++) {
        const newRow = Object.assign([], subscribersRows[i]);
        const numSubscribers = subscribersRows[i][subscribersGainedIndex] - subscribersRows[i][subscribersLostIndex];
        newRow.push(numSubscribers);
        newSubscribersRows.push(newRow);
    }

    const newSubscribersColumnHeader = {name: Metrics.SUBSCRIBERS.name, columnType: 'METRIC', dataType: 'INTEGER'};
    subscribersColumnHeaders.push(newSubscribersColumnHeader);
    
    subscribers.columnHeaders = subscribersColumnHeaders;
    subscribers.rows = newSubscribersRows;
    
    return subscribers;
};

export default computeSubscribers;