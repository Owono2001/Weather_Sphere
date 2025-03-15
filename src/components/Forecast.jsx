import React from 'react';

const Forecast = ({ data }) => {
  const dailyForecast = data.list.filter((item, index) => index % 8 === 0);

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-items">
        {dailyForecast.map((item) => (
          <div key={item.dt} className="forecast-item">
            <p>{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p>{Math.round(item.main.temp)}°C</p>
            <p>{item.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;