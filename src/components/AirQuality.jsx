import React from 'react';
import { WiThermometer, WiBarometer, WiHumidity } from 'react-icons/wi';

const AirQuality = ({ data }) => {
  if (!data || !data.list || !data.list[0]) return null;

  const aqi = data.list[0].main.aqi;
  const getAqiLevel = () => {
    const levels = [
      { label: 'Good', color: '#00e400' },
      { label: 'Fair', color: '#ffff00' },
      { label: 'Moderate', color: '#ff7e00' },
      { label: 'Poor', color: '#ff0000' },
      { label: 'Very Poor', color: '#8f3f97' }
    ];
    return levels[aqi - 1] || levels[0];
  };

  return (
    <div className="air-quality-card">
      <h3>Air Quality Index</h3>
      <div className="aqi-indicator" style={{ 
        backgroundColor: getAqiLevel().color 
      }}>
        {getAqiLevel().label} (AQI {aqi})
      </div>
      <div className="pollutants">
        <div>
          <WiThermometer />
          <span>PM2.5: {data.list[0].components.pm2_5} μg/m³</span>
        </div>
        <div>
          <WiBarometer />
          <span>CO: {data.list[0].components.co} μg/m³</span>
        </div>
        <div>
          <WiHumidity />
          <span>NO2: {data.list[0].components.no2} μg/m³</span>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;