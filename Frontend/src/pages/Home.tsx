import { useEffect, useState } from "react";
import { Countries, Flag } from "../types/types";
import { getCountries } from "../api/getCountries";
import { Link } from "react-router-dom";
import { getFlags } from "../api/getFlags";

const Home = () => {
  const [countries, setCountries] = useState<Countries[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching countries...");
    getCountries()
      .then(data => {
        setCountries(data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    getFlags()
      .then((data) => {
        setFlags(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const mergedData = countries.map(country => {
    const flag = flags.find(flag => flag.name === country.name);
    return { ...country, flag: flag?.flag };
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Available Countries
      </h1>
      {error ? (
        <p className="bg-red-500 text-white font-medium text-center p-4 rounded">
          {error}
        </p>
      ) : mergedData.length === 0 ? (
        <p className="text-gray-700 text-center">Loading...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mergedData.map((country) => (
            <li
              key={country.countryCode}
              className="p-4 bg-white shadow-md rounded hover:shadow-lg transition duration-300"
            >
              <Link
                to={`/country/${country.countryCode}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                <div className="flex items-center justify-between">
                  {country.flag && (
                    <img
                      src={country.flag}
                      alt={`Flag of ${country.name}`}
                      className="w-12 h-8 object-cover rounded mr-4"
                    />
                  )}
                  {country.name}
                  <p className="text-sm text-gray-600">{country.countryCode}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
