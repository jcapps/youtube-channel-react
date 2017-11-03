import getAllCountries from './getAllCountries';

const retrieveCountryInfo = (letterCode) => {
    letterCode = letterCode.toUpperCase();
    const countries = getAllCountries();
    
    let foundCountry = {
        cca2: 'ZZ',
        cca3: 'ZZZ',
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