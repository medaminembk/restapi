const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './config/.env' });

const app = express();
const port = 3000; // Change this to your desired port

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route to add a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route to edit a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
    res.json(user);
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route to remove a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndRemove(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
