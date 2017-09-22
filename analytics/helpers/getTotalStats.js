const getTotalStats = (totalStats, columnName) => {
    let totalValue = 0;
    if (totalStats.columnHeaders) {
        const totalStatsColumns = totalStats.columnHeaders.map(item => {
            return item.name;
        });
        if (totalStats.rows) {
            if (totalStatsColumns.indexOf(columnName) >= 0)
            totalValue = totalStats.rows[0][totalStatsColumns.indexOf(columnName)];
        }
    }
    return totalValue;
};

export default getTotalStats;