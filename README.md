# WeatherSphere 🌤️ <br> Real-Time Weather & Forecast Visualization

[![React Version](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Profile Views](https://komarev.com/ghpvc/?username=Owono2001&style=for-the-badge&color=brightgreen)](https://github.com/Owono2001/)

> A modern, beautifully designed weather application providing real-time conditions, interactive forecasts, and air quality insights at your fingertips. Experience weather data brought to life with smooth animations and a clean user interface.

<br>

<p align="center">
  <img src="public/weatherwebApp.png" alt="WeatherSphere Application Screenshot" width="80%">
</p>

---

## ✨ Core Features

* **🌡️ Real-Time Conditions:** Instantly access current temperature, humidity, wind speed, and more.
* **📊 5-Day Interactive Forecast:** Visualize upcoming weather trends with detailed charts. Hover for specifics!
* **🌬️ Air Quality Monitoring:** Stay informed about air pollution levels (AQI) in your selected location.
* **📍 Geolocation Support:** Automatically fetch weather for your current location with a single click.
* **🔄 Unit Conversion:** Seamlessly switch between Celsius (°C) and Fahrenheit (°F).
* **📜 Search History:** Quickly revisit weather for previously searched cities.
* **📱 Responsive Design:** Enjoy a flawless experience on desktops, tablets, and mobile devices.
* **🎬 Smooth Animations:** Subtle transitions and effects powered by Framer Motion enhance user experience.

---

## 🛠️ Tech Stack & Tools

* **Frontend:** React 18
* **Animations:** Framer Motion
* **Data Fetching:** Axios
* **Charting:** React ChartJS 2
* **Icons:** Weather Icons (customized or library-specific)
* **Styling:** CSS3 Animations, Modern CSS Practices
* **API:** OpenWeatherMap
    * Current Weather: `api.openweathermap.org/data/2.5/weather`
    * 5-Day Forecast: `api.openweathermap.org/data/2.5/forecast`
    * Air Quality: `api.openweathermap.org/data/2.5/air_pollution`

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

* Node.js (v16.13.0 or higher recommended) - [Download Node.js](https://nodejs.org/)
* npm (v8.1.0 or higher recommended) or yarn
* An OpenWeatherMap API Key - [Get your key here](https://openweathermap.org/appid)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Owono2001/Weather_Sphere.git](https://github.com/Owono2001/Weather_Sphere.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Weather_Sphere
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or if you prefer yarn
    # yarn install
    ```
4.  **Configure your API Key:**
    * Create a `.env` file in the root of the project.
    * Add your OpenWeatherMap API key like this:
        ```env
        REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
        ```
        *(Replace `your_api_key_here` with your actual key)*

5.  **Start the development server:**
    ```bash
    npm start
    # or
    # yarn start
    ```
    The application should now be running on `http://localhost:3000` (or another port if 3000 is busy).

---

## 💡 Usage Guide

* **Geolocation:** Click the 📍 icon (or similar) to fetch weather based on your current browser location (requires permission).
* **City Search:** Enter a city name. For better accuracy, include the country code (e.g., `London, GB`, `Tokyo, JP`).
* **Interactive Charts:** Hover your mouse over the forecast charts to see detailed data points for specific times.
* **Recent Searches:** Click on a city name in the search history list to quickly load its weather again.
* **Unit Toggle:** Look for a °C/°F switch to change temperature units.

---

## 🤔 Troubleshooting

* **API Key Errors / No Data:**
    * Double-check that your `.env` file is correctly named (`.env`) and located in the project root.
    * Verify that the variable name inside `.env` is exactly `REACT_APP_OPENWEATHER_API_KEY`.
    * Ensure the API key itself is correct and active on the OpenWeatherMap website.
    * Confirm your internet connection is stable.
* **Incorrect Location Data:**
    * Ensure you've spelled the city name correctly. Using the country code can help resolve ambiguities (e.g., `Paris, FR` vs. `Paris, US`).
    * Check browser location permissions if using the geolocation feature.

---

## 📜 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.

---

<p align="center">
  Happy Weather Watching! ☀️🌧️❄️
</p>
