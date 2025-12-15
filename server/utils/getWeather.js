const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Get current weather
async function getCurrentWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    return `The current temperature in ${city} is ${response.data.main.temp}°C with ${response.data.weather[0].description}.`;
}

// Get tomorrow's weather
async function getTomorrowWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const tomorrowData = response.data.list.filter(item =>
        item.dt_txt.startsWith(tomorrowDate)
    );

    if (tomorrowData.length === 0) {
        return `No forecast data available for tomorrow in ${city}.`;
    }

    const avgTemp =
        tomorrowData.reduce((sum, item) => sum + item.main.temp, 0) /
        tomorrowData.length;

    return `Tomorrow's average temperature in ${city} will be around ${avgTemp.toFixed(1)}°C with ${tomorrowData[0].weather[0].description}.`;
}

// Get multi-day forecast
async function getMultiDayForecast(city, days = 3) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);

    const forecasts = {};
    response.data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!forecasts[date]) forecasts[date] = [];
        forecasts[date].push(item.main.temp);
    });

    const today = new Date().toISOString().split('T')[0];
    const dates = Object.keys(forecasts).filter(d => d !== today).slice(0, days);

    let forecastMsg = `Weather forecast for the next ${days} days in ${city}:\n`;
    dates.forEach(date => {
        const avg =
            forecasts[date].reduce((sum, t) => sum + t, 0) / forecasts[date].length;
        forecastMsg += `${date}: ~${avg.toFixed(1)}°C\n`;
    });

    return forecastMsg.trim();
}

// Export functions
module.exports = {
    getCurrentWeather,
    getTomorrowWeather,
    getMultiDayForecast,
};
