import countries from 'world-countries';

const convertCountryCodes = (twoLetterCode) => {
    let threeLetterCode = 'XXX';

    for (let country in countries) {
        if (country.cca2 == twoLetterCode) {
            threeLetterCode = country.cca3;
            break;
        }
    }
    
    return threeLetterCode;
};

export default convertCountryCodes;