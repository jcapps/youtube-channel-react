const computeSubscribers = (report) => {
    let subscribers = Object.assign({}, report);
    let subscribersRows = Object.assign([], report.rows);
    let subscribersColumnHeaders = Object.assign([], report.columnHeaders);

    const subscribersColumns = subscribersColumnHeaders.map(item => {
        return item.name;
    });
    const subscribersGainedIndex = subscribersColumns.indexOf('subscribersGained');
    const subscribersLostIndex = subscribersColumns.indexOf('subscribersLost');

    let newSubscribersRows = [];
    for (let i = 0; i < subscribersRows.length; i++) {
        const newRow = Object.assign([], subscribersRows[i]);
        const numSubscribers = subscribersRows[i][subscribersGainedIndex] - subscribersRows[i][subscribersLostIndex];
        newRow.push(numSubscribers);
        newSubscribersRows.push(newRow);
    }

    const newSubscribersColumnHeader = {name: 'subscribers', columnType: 'METRIC', dataType: 'INTEGER'};
    subscribersColumnHeaders.push(newSubscribersColumnHeader);
    
    subscribers.columnHeaders = subscribersColumnHeaders;
    subscribers.rows = newSubscribersRows;
    
    return subscribers;
};

export default computeSubscribers;