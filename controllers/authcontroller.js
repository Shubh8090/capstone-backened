const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, password, email, mobile } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if the password meets the minimum length requirement
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Create a new user with additional fields
    const newUser = new User({ username, password, email, mobile });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const login = async (req, res) => {
  try {
    console.log('Received login request:', req.body);

    const { username, password } = req.body;
    console.log('Username:', username);

    const user = await User.findOne({ username });
    console.log('Found user:', user);

    // Check if the user exists
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the password in the database
    if (password !== user.password) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Password is valid , generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    console.log('Login successful');
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  register,
  login,
};