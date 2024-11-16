const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');
const { placeOrder, updateOrderStatus, getAvailableDeliveries, acceptDelivery, updateDeliveryStatus} = require('../controllers/orderController');

router.use(authenticateUser);
router.post('/', placeOrder);
router.patch('/:id', updateOrderStatus);
// View available deliveries for delivery personnel
router.get('/available', getAvailableDeliveries);

// Accept an order for delivery
router.patch('/:orderId/accept', acceptDelivery);

// Update the status of a delivery
router.patch('/:orderId/status', updateDeliveryStatus);
module.exports = router;
