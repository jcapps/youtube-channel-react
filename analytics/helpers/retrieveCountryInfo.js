import countries from 'world-countries';

const retrieveCountryInfo = (twoLetterCode) => {
    let foundCountry = {
        cca3: 'XXX'
    };

    for (let country of countries) {
        if (country.cca2 == twoLetterCode) {
            foundCountry = country;
        }
    }

    return foundCountry;
};

export default retrieveCountryInfo;