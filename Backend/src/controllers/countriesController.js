const axios = require('axios');

exports.getAvailableCountries = async (req, res) => {
  try {
    const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching available countries:', error);
    res.status(500).json({ 
      message: 'Failed to fetch available countries',
      error: error.message 
    });
  }
};

exports.getCountryInfo = async (req, res) => {
  const { countryCode } = req.params;

  try {
    const borderCountriesResponse = await axios.get(
      `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
    );

    const populationResponse = await axios.get(
      'https://countriesnow.space/api/v0.1/countries/population', 
      { params: { country: borderCountriesResponse.data.commonName } }
    );

    const flagResponse = await axios.get(
      'https://countriesnow.space/api/v0.1/countries/flag/images', 
      { params: { country: borderCountriesResponse.data.commonName } }
    );

    const countryInfo = {
      ...borderCountriesResponse.data,
      
      population: populationResponse.data.data,
      
      flagUrl: flagResponse.data.data.flag
    };

    res.json(countryInfo);
  } catch (error) {
    console.error('Error fetching country information:', error);
    res.status(500).json({ 
      message: 'Failed to fetch country information',
      error: error.message 
    });
  }
};