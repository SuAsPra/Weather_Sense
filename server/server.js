  const User = require('./models/User');



  const express = require('express');
  const fetch = require('node-fetch');
  const router = express.Router();

  router.post('/chatbot', async (req, res) => {
    const { message } = req.body;
    try {
      // Basic AI-like response logic
      if (message.toLowerCase().includes("weather")) {
        const city = message.match(/in\s+(\w+)/i)?.[1] || "London";
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.main) {
          return res.json({ reply: `The temperature in ${city} is ${data.main.temp}°C with ${data.weather[0].description}.` });
        }
      }
      res.json({ reply: "I couldn't fetch the weather right now. Try again." });
    } catch (error) {
      console.error(error);
      res.json({ reply: "Sorry, something went wrong." });
    }
  });

  module.exports = router;






















// Check if username exists
const checkUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(200).json({ available: false, message: "Username is taken" });
    } else {
      return res.status(200).json({ available: true, message: "Username is available" });
    }
  } catch (error) {
    return res.status(500).json({ available: false, message: "Server error" });
  }
};

const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { signup, login, checkUsername };
