import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import Loading from './components/Loading';
import AirQuality from './components/AirQuality';
import ErrorBoundary from './components/ErrorBoundary';

import './App.css';

const profilePhoto = process.env.PUBLIC_URL + '/assets/images/myphoto.jpg';

const CACHE_EXPIRATION = 15 * 60 * 1000; // 15 minutes




const App = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [recentSearches, setRecentSearches] = useState([]);
  const [background, setBackground] = useState('');
  const [apiCache, setApiCache] = useState(new Map());

  // Load cached data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherCache');
    if (saved) {
      try {
        const { recent, unit: savedUnit, cache } = JSON.parse(saved);
        setRecentSearches(recent || []);
        setUnit(savedUnit || 'metric');
        setApiCache(new Map(cache || []));
      } catch (e) {
        console.error('Failed to load cache:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const cacheData = {
      recent: recentSearches.slice(0, 5),
      unit,
      cache: Array.from(apiCache.entries())
    };
    localStorage.setItem('weatherCache', JSON.stringify(cacheData));
  }, [recentSearches, unit, apiCache]);

  const handleApiError = useCallback((err) => {
    let errorMessage = 'Failed to fetch weather data';
    if (err.response) {
      switch (err.response.status) {
        case 400: errorMessage = 'Invalid location'; break;
        case 401: errorMessage = 'Invalid API Key'; break;
        case 404: errorMessage = 'Location not found'; break;
        case 429: errorMessage = 'Too many requests'; break;
        default: errorMessage = `Server error: ${err.response.status}`;
      }
    } else if (err.request) {
      errorMessage = 'Network error';
    }
    setError(errorMessage);
    console.error('API Error:', err);
  }, []);

  const validateData = useCallback((data, type) => {
    const validators = {
      weather: d => d?.weather?.[0]?.main && d.main?.temp,
      forecast: d => d?.list?.length && d.city?.name,
      airQuality: d => d?.list?.[0]?.main?.aqi
    };
    if (!validators[type](data)) throw new Error(`Invalid ${type} data`);
  }, []);

  const updateBackground = useCallback((weatherCondition) => {
    const backgrounds = {
      Clear: 'linear-gradient(135deg, #87CEEB, #00BFFF)',
      Clouds: 'linear-gradient(135deg, #B0C4DE, #778899)',
      Rain: 'linear-gradient(135deg, #4682B4, #6A5ACD)',
      Snow: 'linear-gradient(135deg, #F0FFFF, #E0FFFF)'
    };
    setBackground(backgrounds[weatherCondition] || '#f8f9fa');
  }, []);

  const updateRecentSearches = useCallback((location) => {
    setRecentSearches(prev => [
      location,
      ...prev.filter(item => item !== location).slice(0, 4)
    ]);
  }, []);

  const fetchWeatherData = useCallback(async (location) => {
    const cacheKey = typeof location === 'object' 
      ? `${location.lat},${location.lon},${unit}`
      : `${location},${unit}`;

    // Check cache
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
      setWeather(cached.weather);
      setForecast(cached.forecast);
      setAirQuality(cached.airQuality);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const isGeoLocation = typeof location === 'object';
      const params = isGeoLocation 
        ? { lat: location.lat, lon: location.lon, units: unit }
        : { q: location, units: unit };

      const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
      const baseUrl = 'https://api.openweathermap.org/data/2.5';

      const urls = [
        `${baseUrl}/weather?${new URLSearchParams({ ...params, appid: API_KEY })}`,
        `${baseUrl}/forecast?${new URLSearchParams({ ...params, appid: API_KEY })}`,
        `${baseUrl}/air_pollution?${new URLSearchParams({ ...params, appid: API_KEY })}`
      ];

      const responses = await Promise.allSettled(urls.map(url =>
        axios.get(url).catch(e => ({ status: 'rejected', reason: e }))
      ));

      const [currentRes, forecastRes, airQualityRes] = responses;

      // Handle responses
      if (currentRes.status === 'rejected') throw currentRes.reason;
      
      const current = currentRes.value.data;
      const forecast = forecastRes.status === 'fulfilled' ? forecastRes.value.data : null;
      const airQuality = airQualityRes.status === 'fulfilled' ? airQualityRes.value.data : null;

      validateData(current, 'weather');
      if (forecast) validateData(forecast, 'forecast');
      if (airQuality) validateData(airQuality, 'airQuality');

      // Update state
      setWeather(current);
      setForecast(forecast);
      setAirQuality(airQuality);
      updateBackground(current.weather[0].main);
      updateRecentSearches(isGeoLocation ? current.name : location);

      // Update cache
      setApiCache(prev => new Map(prev).set(cacheKey, {
        weather: current,
        forecast,
        airQuality,
        timestamp: Date.now()
      }));

    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [unit, 
      apiCache, 
      validateData, 
      handleApiError,
      updateBackground,
      updateRecentSearches
    ]);

  

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => fetchWeatherData({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }),
      error => setError(`Geolocation error: ${error.message}`)
    );
  }, [fetchWeatherData]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const newUnit = prev === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('preferredUnit', newUnit);
      return newUnit;
    });
  }, []);

  const memoizedWeatherCard = useMemo(() => (
    <WeatherCard 
      data={weather} 
      forecast={forecast}
      unit={unit}
      airQuality={airQuality}
    />
  ), [weather, forecast, unit, airQuality]);

  return (
    <ErrorBoundary>
      <div className="app" style={{ background }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container"
        >
          <header className="header">
          <div className="profile-section">
            <img 
              src={profilePhoto} 
              alt="Your Name" 
              className="profile-photo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="profile-bio">
              <h1 className="title">
                <span className="weather-text">Weather</span>
                <span className="sphere-text">Sphere</span>
                <span className="weather-icon">⛅</span>
              </h1>
              <div className="bio-text">
                Final-Year Computer Engineering Student<br />
                AI & Software Development | Spanish Tutor
              </div>
            </div>
          </div>
          
          <div className="controls">
            <button onClick={toggleUnit} className="unit-toggle">
              °{unit === 'metric' ? 'C' : 'F'}
            </button>
            <button onClick={handleGeolocation} className="geo-button">
              📍 My Location
            </button>
          </div>
        </header>

          <SearchBar 
            onSearch={fetchWeatherData} 
            recentSearches={recentSearches}
          />

          <AnimatePresence>
            {loading && <Loading />}
          </AnimatePresence>

          {error && (
            <motion.div
              className="error-banner"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              {error} 
              <button onClick={() => setError('')} className="close-error">
                ×
              </button>
            </motion.div>
          )}

          {weather && (
            <div className="weather-dashboard">
              {memoizedWeatherCard}
              
              <div className="additional-info">
                <Forecast data={forecast} unit={unit} />
                <AirQuality data={airQuality} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(App);