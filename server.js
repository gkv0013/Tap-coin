const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables from a .env file if present
require('dotenv').config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Import database configuration (This file can be swapped based on the database you are using)
const db = require('./db');

// Define the user schema and model (example using Mongoose for MongoDB)
const User = db.User;

// Routes

// Create a new user
app.post('/api/user', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a user by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a user by ID
app.put('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Listen on the configured port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
