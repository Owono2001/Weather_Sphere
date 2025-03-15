import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios'; // Add this import statement


const SearchBar = ({ onSearch, recentSearches }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const sanitizeInput = (input) => {
    return input.trim().replace(/[^a-zA-Z\u00C0-\u017F\s,'-]/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedQuery = sanitizeInput(query);
    if (sanitizedQuery) {
      onSearch(sanitizedQuery);
      setQuery('');
    }
  };

  const handleRecentSearch = (search) => {
    onSearch(search);
  };

  // Debounced search suggestions
  useEffect(() => {
    if (!query) return;
    
    const timer = setTimeout(() => {
      axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`)
        .then(res => setSuggestions(res.data))
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                onSearch(item.name);
                setQuery('');
                setSuggestions([]);
              }}
            >
              {item.name}, {item.country}
            </div>
          ))}
        </div>
      )}

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <p>Recent searches:</p>
          <div className="recent-list">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="recent-item"
                onClick={() => handleRecentSearch(search)}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchBar);