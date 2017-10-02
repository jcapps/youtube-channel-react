const convertSecondsToTimestamp = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = (totalSeconds - (minutes * 60) - (hours * 3600));
    
    if (seconds.toLocaleString().length == 1) seconds = seconds.toLocaleString() + '0';
    let time = minutes + ':' + seconds;
    if (hours > 0) {
        if (minutes.toLocaleString().length == 1) minutes = minutes.toLocaleString() + '0';
        time = hours.toLocaleString() + ':' + minutes + ':' + seconds;
    }

    return time;
};

export default convertSecondsToTimestamp;