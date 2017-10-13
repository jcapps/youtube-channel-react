const convertStateCodes = (isoCode) => {
    return isoCode.split('US-')[1];
};

export default convertStateCodes;