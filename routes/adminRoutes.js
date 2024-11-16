// routes/adminRoutes.js
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');
const { 
    manageUsers, 
    manageOrders, 
    generateReports, 
    monitorPlatformActivity 
} = require('../controllers/adminController');

// Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//     console.log(req.user);
//     console.log(req.user.role);
//     if (req.user && req.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Access denied. Admins only.' });
//     }
// };

const isAdmin = async (req, res, next) => {
    try {
        // Find the user in the database using the userId
        const user = await User.findById(req.user.userId);

        // console.log(user);
        // console.log(user.userId);

        // Check if user exists and if their role is 'admin'
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin role.', error: error.message });
    }
};

// Apply authentication and admin middleware
router.use(authenticateUser, isAdmin);

// Manage Users
router.post('/users/manage', manageUsers);

// Manage Orders
router.post('/orders/manage', manageOrders);

// Generate Reports
router.get('/reports', generateReports);

// Monitor Platform Activity
router.get('/monitor', monitorPlatformActivity);

module.exports = router;
