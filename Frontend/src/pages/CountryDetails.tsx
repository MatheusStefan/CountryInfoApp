import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Country, Flag } from "../types/types";
import { getFlags } from "../api/getFlags";

const CountryDetails = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [country, setCountry] = useState<Country>();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch country details");
        }
        return response.json();
      })
      .then(data => {
        setCountry(data);
      })
      .catch(err => setError(err.message));
  }, [countryCode]);

  useEffect(() => {
    getFlags()
      .then((data) => {
        setFlags(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);


  if (error) {
    return <p className="bg-red-500 text-white p-4 rounded">{error}</p>;
  }

  if (!country) {
    return <p className="text-gray-700 text-center">Loading country details...</p>;
  }

  const countryFlag = flags.find(flag => flag.iso2 === country.countryCode || flag.iso3 === country.countryCode);

  return (
    <div className="w-full bg-gray-100 p-6 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Country Name: {country.commonName}</h1>
      {countryFlag ? (
        <img
          src={countryFlag.flag}
          alt={`Flag of ${country.commonName}`}
          className="w-32 h-32 object-cover"
        />
      ) : (
        <p className="text-red-500">Flag not available</p>
      )}

      <h2 className="font-medium">Official name: {country.officialName}</h2>

      <div className="flex flex-col items-center justify-between my-5 border-2 border-gray-900 rounded-xl p-2">
        <p className="text-lg">Country Code: {country.countryCode}</p>
        <p className="text-lg italic">Country Region: {country.region}</p>
      </div>
      <div className="w-fit flex flex-col items-center border-2 border-gray-900 p-2 rounded-xl">
        {country.borders ? (
          <>
            <h3 className="font-bold text-2xl">Borders</h3>
            <ul className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {country.borders.map((border) => (
                <li key={border.countryCode} className="text-sm text-gray-500 hover:text-black transition-all duration-300">
                  <Link to={`/country/${border.countryCode}`}>
                    {border.commonName} ({border.countryCode})
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-gray-500">No borders available</p>
        )}
      </div>
    </div>
  );
}

export default CountryDetails;