import countries from 'world-countries';

const getAllCountries = () => {
    const allCountries = Object.assign([], countries);

    // Add regions not included in the 'world-countries' library
    // (Region must at least include name.common, name.official, latlng, cca2, cca3)

    // Caribbean Netherlands (Bonaire, Sint Eustatius, and Saba)
    const CaribbeanNetherlands = {
        name: {
            common: 'Caribbean Netherlands',
            official: 'Bonaire, Sint Eustatius and Saba'
        },
        cca2: 'BQ',
        cca3: 'BES',
        latlng: [12.183333, -68.233333]
    };

    // Clipperton Island
    const ClippertonIsland = {
        name: {
            common: 'Clipperton Island',
            official: 'Clipperton Island'
        },
        cca2: 'CP',
        cca3: 'CLP',
        latlng: [10.3, -109.21666666]
    };

    // Saint Helena, Ascension and Tristan da Cunha
    const shnIslands = require(`world-countries/data/shn.divisions.json`);
    const SaintHelena = shnIslands.find(island => {
        return island.name.common == 'Saint Helena';
    });
    const Ascension = shnIslands.find(island => {
        return island.name.common == 'Ascension';
    });
    const TristanDaCunha = shnIslands.find(island => {
        return island.name.common == 'Tristan da Cunha';
    });
    Ascension.cca2 = 'AC';
    Ascension.cca3 = 'ASC';
    TristanDaCunha.cca2 = 'TA';
    TristanDaCunha.cca3 = 'TAA';

    allCountries.push(CaribbeanNetherlands);
    allCountries.push(ClippertonIsland);
    allCountries.push(SaintHelena);
    allCountries.push(Ascension);
    allCountries.push(TristanDaCunha);

    return allCountries;
};

export default getAllCountries;