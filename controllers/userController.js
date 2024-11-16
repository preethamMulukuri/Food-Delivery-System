const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'preetham@1';

// Helper function to generate JWT token
const generateAuthToken = (userId) => {
    // Generate JWT token with user ID as payload and a secret key
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  };

const registerUser = async (req, res) => {
   try {
      const { name, email, password, role } = req.body;
      const user = new User({ name, email, password, role });
      await user.save();
      res.status(201).json({ message: 'User registered successfully', user });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

const loginUser = async (req, res) => {
   // Add authentication logic here
   try{
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    //console.log(user);
    //console.log(user);
    if (!user) {
      return res.status(401).json({error: 'Invalid email or password' });
    }

    console.log(password, user.password);

    // Compare password
    //const isMatch = await bcrypt.compare(password, user.password); // Use hashed password
    if (password != user.password) {
      return res.status(401).json({ error: 'Invalid email or password' }); // Avoid revealing specific error
    }

    // // Generate a secure JSON Web Token (JWT) for authentication (optional but recommended)
    // const token = await generateAuthToken(user._id); // Replace with your JWT generation function

    // Generate a secure JSON Web Token (JWT) for authentication
    const token = generateAuthToken(user._id);

    res.status(200).json({ message: 'User Login successfully', token }); // Send the token if using JWT
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all restaurants
const browseRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json({ message: 'Restaurants fetched successfully', restaurants });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/userController.js

// Search menu items
const searchMenu = async (req, res) => {
    const { query } = req.query; // 'query' parameter in URL
    try {
        const restaurants = await Restaurant.find({
            'menu.name': { $regex: query, $options: 'i' } // case-insensitive search
        }, {
            name: 1,
            menu: { $elemMatch: { name: { $regex: query, $options: 'i' } } } // only matching items
        });

        res.json({ message: 'Menu items fetched successfully', restaurants });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// controllers/userController.js

// View order history for a user
const viewOrderHistory = async (req, res) => {
    const userId = req.params.userId;
    try {
        const orders = await Order.find({ customer: userId }).populate('restaurant', 'name').populate('items.menuItem', 'name');
        res.json({ message: 'Order history fetched successfully', orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// // Optional: Function to generate a JWT (replace with your implementation)
// async function generateAuthToken(userId) {
//     // Implement your JWT generation logic using a library like jsonwebtoken
//     // ...
//   }

module.exports = { registerUser, loginUser, browseRestaurants, searchMenu, viewOrderHistory };
