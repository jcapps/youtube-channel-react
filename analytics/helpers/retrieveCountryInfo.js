import countries from 'world-countries';

const retrieveCountryInfo = (letterCode) => {
    letterCode = letterCode.toUpperCase();
    
    let foundCountry = {
        cca2: 'XX',
        cca3: 'XXX',
        name: {common: 'Unknown Region'}
    };

    for (let country of countries) {
        if (letterCode.length == 2) {
            if (country.cca2 == letterCode) {
                foundCountry = country;
            }
        }
        if (letterCode.length == 3) {
            if (country.cca3 == letterCode) {
                foundCountry = country;
            }
        }
    }

    return foundCountry;
};

export default retrieveCountryInfo;