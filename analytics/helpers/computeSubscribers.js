const computeSubscribers = (subscribersGained, subscribersLost) => {
    let subscribers = Object.assign({}, subscribersGained);
    let unsubscribers = Object.assign({}, subscribersLost);
    let subscribersRows = Object.assign([], subscribersGained.rows);
    let unsubscribersRows = Object.assign([], subscribersLost.rows);
    let subscribersColumnHeaders = Object.assign([], subscribersGained.columnHeaders);
    let unsubscribersColumnHeaders = Object.assign([], subscribersLost.columnHeaders);

    const subscribersColumns = subscribersColumnHeaders.map(item => {
        return item.name;
    });
    const unsubscribersColumns = unsubscribersColumnHeaders.map(item => {
        return item.name;
    });
    const subscribersGainedIndex = subscribersColumns.indexOf('subscribersGained');
    const subscribersLostIndex = unsubscribersColumns.indexOf('subscribersLost');

    let newSubscribersRows = [];
    for (let i = 0; i < subscribersRows.length; i++) {
        const newRow = Object.assign([], subscribersRows[i]);
        const numSubscribers = subscribersRows[i][subscribersGainedIndex] - unsubscribersRows[i][subscribersLostIndex];
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