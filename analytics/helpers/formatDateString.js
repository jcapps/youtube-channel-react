const formatDateString = date => {
    let yyyy = date.getFullYear().toString();
    let mm = padToTwoCharacters(date.getMonth() + 1);
    let dd = padToTwoCharacters(date.getDate());

    return yyyy + '-' + mm + '-' + dd;
}

const padToTwoCharacters = number => {
    if (number < 10) {
        return '0' + number;
    } else {
        return number.toString();
    }
}

export default formatDateString;