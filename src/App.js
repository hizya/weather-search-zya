import React from 'react';
import { useFetchLocation } from './useFetchLocation';
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], '☀️'],
    [[1], '🌤'],
    [[2], '⛅️'],
    [[3], '☁️'],
    [[45, 48], '🌫'],
    [[51, 56, 61, 66, 80], '🌦'],
    [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
    [[71, 73, 75, 77, 85, 86], '🌨'],
    [[95], '🌩'],
    [[96, 99], '⛈'],
  ]);
  const arr = [...icons.keys()].find(key => key.includes(wmoCode));
  if (!arr) return 'NOT FOUND';
  return icons.get(arr);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(dateStr));
}

export default function App() {
  const [location, setLocation, displayLocation, weather, isLoading] =
    useFetchLocation();

  return (
    <div className="app">
      <h1>classy weather</h1>
      <div>
        <input value={location} onChange={e => setLocation(e.target.value)} />
      </div>
      {/* <button onClick={() => getWeather(location)}>get location</button> */}
      {isLoading && <div className="loading">loading</div>}
      {!isLoading && weather.time && (
        <Weather weather={weather} displayLocation={displayLocation} />
      )}
    </div>
  );
}

function Weather({ weather, displayLocation }) {
  const {
    time: dates,
    weathercode: wmoCode,
    temperature_2m_max: max,
    temperature_2m_min: min,
  } = weather;

  return (
    <div>
      <h2>{displayLocation}</h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            max={max.at(i)}
            min={min.at(i)}
            wmoCode={wmoCode.at(i)}
            key={date}
            date={date}
            isToday={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}

function Day({ max, min, wmoCode, date, isToday }) {
  return (
    <li className="day">
      <span>{getWeatherIcon(wmoCode)}</span>
      <div>{isToday ? 'Today' : formatDay(date)}</div>
      <div>
        {Math.floor(max)}&deg; &mdash; <strong>{Math.ceil(min)}&deg;</strong>
      </div>
    </li>
  );
}
