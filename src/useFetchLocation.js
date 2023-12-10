import { useEffect, useState } from 'react';

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export function useFetchLocation() {
  const [location, setLocation] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function getLocation() {
        try {
          setIsLoading(true);
          // prettier-ignore
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`,{ signal: controller.signal });
          const geoData = await geoRes.json();

          if (!geoData.results) throw new Error('Location not found');

          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);
          setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          const weatherData = await weatherRes.json();
          setWeather(weatherData.daily);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      if (location.length <= 2) return;
      getLocation();
      return function () {
        controller.abort();
      };
    },
    [location]
  );
  return [location, setLocation, displayLocation, weather, isLoading];
}
