// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, browseRestaurants, searchMenu, viewOrderHistory } = require('../controllers/userController');

// User registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Browse all restaurants
router.get('/restaurants', browseRestaurants);

// Search for menu items
router.get('/restaurants/search', searchMenu);

// View order history for a specific user
router.get('/:userId/orders', viewOrderHistory);

module.exports = router;
