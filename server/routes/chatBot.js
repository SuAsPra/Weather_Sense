const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const { getCurrentWeather, getTomorrowWeather, getMultiDayForecast } = require('../utils/getWeather');


//Chatbot route for weather info
router.post('/weather-info', async (req, res) => {
  const { prompt } = req.body;
  try {
    const userMessage = prompt.toLowerCase();
    let reply;

    // Parse city and intent 
    const cityMatch = userMessage.match(/in ([a-zA-Z\s]+)/);
    const city = cityMatch ? cityMatch[1].trim() : null;

    if (!city) {
      reply = "Please tell me a city, e.g., 'weather in Chennai'.";
    } else if (userMessage.includes('tomorrow')) {
      reply = await getTomorrowWeather(city);
    } else if (userMessage.includes('next') || userMessage.includes('few days')) {
      reply = await getMultiDayForecast(city, 3);
    } else {
      reply = await getCurrentWeather(city);
    }

    res.json({ reply });
  } catch (error) {
    // console.error(error);
    res.json({ error: error.message });
  }
});

// // Chatbot route
// router.post('/chatbot', async (req, res) => {
//   const { message } = req.body;
//   try {
//     // Basic AI-like response logic
//     if (message.toLowerCase().includes("weather")) {
//       const city = message.match(/in\s+(\w+)/i)?.[1] || "London";
//       const apiKey = process.env.OPENAI_API_KEY;
//       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
//       const data = await response.json();
//       if (data.main) {
//         return res.json({ reply: `The temperature in ${city} is ${data.main.temp}°C with ${data.weather[0].description}.` });
//       }
//     }
//     res.json({ reply: "I couldn't fetch the weather right now. Try again." });
//   } catch (error) {
//     console.error(error);
//     res.json({ reply: "Sorry, something went wrong." });
//   }
// });

module.exports = router;

