const User = require('../models/User');
const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res) => {
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
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ username: user.username, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});


module.exports = router;


// // Check if username exists
// const checkUsername = async (req, res) => {
//   const { username } = req.params;

//   try {
//     const user = await User.findOne({ username });
//     if (user) {
//       return res.status(200).json({ available: false, message: "Username is taken" });
//     } else {
//       return res.status(200).json({ available: true, message: "Username is available" });
//     }
//   } catch (error) {
//     return res.status(500).json({ available: false, message: "Server error" });
//   }
// };

// const signup = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) return res.status(400).json({ message: "Username already taken" });

//     const newUser = new User({ username, password });
//     await newUser.save();

//     res.status(201).json({ message: "Signup successful" });
//   } catch (error) {
//     res.status(500).json({ error: "Signup failed" });
//   }
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username, password });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     res.status(200).json({ username: user.username });
//   } catch (error) {
//     res.status(500).json({ error: "Login failed" });
//   }
// };

// module.exports = { signup, login, checkUsername };