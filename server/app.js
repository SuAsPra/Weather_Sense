const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/Auth');
const chatbotRoute = require('./routes/chatBot'); // <-- if you have chatbot route

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


// API routes
app.use('/api/auth', authRoutes);
app.use('/api', chatbotRoute);

// Serve React frontend after build
// app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '../client/build/index.html'));
  res.send('Hello World!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
