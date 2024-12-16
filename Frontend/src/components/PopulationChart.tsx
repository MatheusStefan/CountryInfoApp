import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useParams } from 'react-router-dom';
import { ApiResponse, Country, Population } from '../types/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PopulationChart: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [populationData, setPopulationData] = useState<Population | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopulationData = async () => {
      if (!countryCode) {
        setError('No country code provided');
        setLoading(false);
        return;
      }

      try {
        const countryResponse = await fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        if (!countryResponse.ok) {
          throw new Error('Failed to fetch country details');
        }
        const countryData: Country = await countryResponse.json();

        const populationResponse = await fetch('https://countriesnow.space/api/v0.1/countries/population');
        const populationApiData: ApiResponse = await populationResponse.json();

        if (populationApiData.error) {
          throw new Error(populationApiData.msg || 'Failed to fetch population data');
        }

        const matchedPopData = populationApiData.data.find(
          (item) => 
            item.code.toLowerCase() === countryCode.toLowerCase() || 
            item.country.toLowerCase() === countryData.commonName.toLowerCase()
        );

        if (matchedPopData) {
          setPopulationData(matchedPopData);
        } else {
          setError('Country population data not found');
        }
      } catch (err) {
        console.error('Error fetching population data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPopulationData();
  }, [countryCode]);

  const sortedPopulationCounts = populationData?.populationCounts.sort((a, b) => a.year - b.year) || [];

  const chartData = {
    labels: sortedPopulationCounts?.map((count) => count.year) || [],
    datasets: [
      {
        label: `${populationData?.country || 'Country'} Population`,
        data: populationData?.populationCounts.map((count) => count.value) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Population Trend for ${populationData?.country || 'Country'}`,
      },
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Population',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-gray-600">Loading population data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Population Trend for {populationData?.country}
      </h2>
      {populationData && populationData.populationCounts.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p className="text-center text-gray-600">No population data available</p>
      )}
    </div>
  );
};

export default PopulationChart;
