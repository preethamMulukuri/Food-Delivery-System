const express = require('express');
const router = express.Router();
const { addRestaurant, addMenuItem, getOrdersForRestaurant, updateOrderStatus, updateRestaurantDetails} = require('../controllers/restaurantController');

router.post('/', addRestaurant);
router.post('/:id/menu', addMenuItem);
// View all orders for a specific restaurant
router.get('/:restaurantId/orders', getOrdersForRestaurant);

// Update the status of a specific order for a restaurant
router.patch('/orders/:orderId/status', updateOrderStatus);

// Update restaurant details
router.patch('/:restaurantId', updateRestaurantDetails);
module.exports = router;
