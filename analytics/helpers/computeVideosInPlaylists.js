const computeVideosInPlaylists = (report) => {
    let videosInPlaylists = Object.assign({}, report);
    let videosInPlaylistsRows = Object.assign([], report.rows);
    let videosInPlaylistsColumnHeaders = Object.assign([], report.columnHeaders);

    const videosInPlaylistsColumns = videosInPlaylistsColumnHeaders.map(item => {
        return item.name;
    });
    const videosAddedToPlaylistsIndex = videosInPlaylistsColumns.indexOf('videosAddedToPlaylists');
    const videosRemovedFromPlaylistsIndex = videosInPlaylistsColumns.indexOf('videosRemovedFromPlaylists');

    let newVideosInPlaylistsRows = [];
    for (let i = 0; i < videosInPlaylistsRows.length; i++) {
        const newRow = Object.assign([], videosInPlaylistsRows[i]);
        const numVideosInPlaylists
            = videosInPlaylistsRows[i][videosAddedToPlaylistsIndex]
            - videosInPlaylistsRows[i][videosRemovedFromPlaylistsIndex];
        newRow.push(numVideosInPlaylists);
        newVideosInPlaylistsRows.push(newRow);
    }

    const newVideosInPlaylistsColumnHeader = {name: 'videosInPlaylists', columnType: 'METRIC', dataType: 'INTEGER'};
    videosInPlaylistsColumnHeaders.push(newVideosInPlaylistsColumnHeader);
    
    videosInPlaylists.columnHeaders = videosInPlaylistsColumnHeaders;
    videosInPlaylists.rows = newVideosInPlaylistsRows;
    
    return videosInPlaylists;
};

export default computeVideosInPlaylists;