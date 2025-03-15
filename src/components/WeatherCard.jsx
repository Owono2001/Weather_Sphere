import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  const data = {
    labels: forecast.list.map(item => 
      new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: forecast.list.map(item => item.main.temp),
        borderColor: '#2a9d8f',
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: forecast.list.map(item => item.main.humidity),
        borderColor: '#264653',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="weather-chart">
      <Line 
        data={data} 
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { 
              display: true, 
              text: '24 Hour Forecast',
              font: { size: 16 }
            }
          },
          scales: {
            x: {
              grid: { display: false }
            },
            y: {
              beginAtZero: true
            }
          }
        }} 
      />
    </div>
  );
};

export default WeatherChart;