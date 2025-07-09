/* eslint-disable @next/next/no-img-element */
// components/Weather.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type WeatherData = {
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  name: string;
};

const Weather = ({ layout = "layout-1" }: { layout: "layout-1" | "layout-2" }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getLocationAndFetchWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          () => {
            setError('Failed to get location');
          }
        );
      } else {
        setError('Geolocation is not supported by this browser');
      }
    };

    const fetchWeather = async (latitude: number, longitude: number) => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: latitude,
              lon: longitude,
              appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY, // Add your API key here
              units: 'metric', // Temperature in Celsius
            },
          }
        );
        setWeather(response.data);
      } catch (error) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    getLocationAndFetchWeather();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!weather) return <div className="text-center">No weather data available.</div>;

  return (
    <>
      {layout === "layout-1" ? (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center">{weather.name}</h2>
          <div className="flex justify-center mt-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
          <div className="text-center mt-4">
            <h3 className="text-xl font-medium capitalize">{weather.weather[0].description}</h3>
            <p className="text-lg">
              {weather.main.temp}°C | Humidity: {weather.main.humidity}%
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-md flex flex-col items-center justify-center relative">
            <div className='flex justify-center items-center'>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              width={60}
              height={60}
            />
            <p className="text-sm">
              {weather.main.temp}°C
            </p>
            </div>
            <h2 className="text-sm font-bold absolute inset-0 text-center top-[2.7rem] left-3">{weather.name}</h2>
          </div>
        </>
      )}
    </>
  );
};

export default Weather;
