const sortDataByCustomColumn = (dataInfo, columnName) => {
    if (!dataInfo.rows || dataInfo.rows.length == 0) {
        return dataInfo;
    }
    let newDataInfo = Object.assign({}, dataInfo);
    let newDataRows = Object.assign([], newDataInfo.rows);

    const columns = dataInfo.columnHeaders.map(item => {
        return item.name;
    });
    const columnIndex = columns.indexOf(columnName);

    newDataRows.sort((a, b) => {
        return b[columnIndex] - a[columnIndex];
    });

    newDataInfo.rows = newDataRows;
    return newDataInfo;
};

export default sortDataByCustomColumn;