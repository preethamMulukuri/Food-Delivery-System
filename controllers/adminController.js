// controllers/adminController.js

const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// Manage Users
const manageUsers = async (req, res) => {
    const { action, userId, userData } = req.body;

    try {
        let user;
        if (action === 'create') {
            user = await User.create(userData);
        } else if (action === 'update') {
            user = await User.findByIdAndUpdate(userId, userData, { new: true });
        } else if (action === 'deactivate') {
            user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        res.json({ message: `User ${action}d successfully`, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View and Manage Orders
const manageOrders = async (req, res) => {
    const { action, orderId, orderData } = req.body;

    try {
        let order;
        if (action === 'view') {
            order = await Order.find().populate('restaurant deliveryPerson customer');
        } else if (action === 'cancel' || action === 'reschedule') {
            order = await Order.findByIdAndUpdate(orderId, orderData, { new: true });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        res.json({ message: `Order ${action}d successfully`, order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate Reports
const generateReports = async (req, res) => {
    try {
        const popularRestaurants = await Order.aggregate([
            { $group: { _id: "$restaurant", totalOrders: { $sum: 1 } } },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 }
        ]);

        const avgDeliveryTime = await Order.aggregate([
            {
                $match: { status: 'delivered' }
            },
            {
                $group: {
                    _id: null,
                    avgTime: { $avg: { $subtract: ['$deliveredAt', '$createdAt'] } }
                }
            }
        ]);

        res.json({
            popularRestaurants,
            avgDeliveryTime: avgDeliveryTime[0]?.avgTime || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Monitor Platform Activity
const monitorPlatformActivity = async (req, res) => {
    try {
        const activeUsers = await User.countDocuments({ active: true });
        const ongoingDeliveries = await Order.countDocuments({ status: 'en route' });
        const orderStatuses = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({
            activeUsers,
            ongoingDeliveries,
            orderStatuses
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    manageUsers,
    manageOrders,
    generateReports,
    monitorPlatformActivity
};
