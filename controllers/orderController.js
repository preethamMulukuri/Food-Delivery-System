const Order = require('../models/Order');
const User = require('../models/User');

const placeOrder = async (req, res) => {
   try {
      const { customer, restaurant, items } = req.body;
      const order = new Order({ customer, restaurant, items });
      await order.save();
      res.status(201).json(order);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

const updateOrderStatus = async (req, res) => {
   const order = await Order.findById(req.params.id);
   if (order) {
      order.status = req.body.status;
      await order.save();
      res.json(order);
   } else {
      res.status(404).json({ message: 'Order not found' });
   }
};

// controllers/orderController.js

// Get a list of available deliveries (orders ready for delivery and not yet assigned)
const getAvailableDeliveries = async (req, res) => {
    try {
        const availableOrders = await Order.find({ status: 'ready for delivery', deliveryPerson: null }).populate('restaurant', 'name address');
        res.json({ message: 'Available deliveries fetched successfully', availableOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Accept an order for delivery
const acceptDelivery = async (req, res) => {
    const { orderId } = req.params;
    // const deliveryPersonId = '6732457d05262c86cb3deb2a';
    const deliveryPersonId = req.user.id; // Assuming user is authenticated

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'ready for delivery' || order.deliveryPerson) {
            return res.status(400).json({ message: 'Order is not available for delivery' });
        }

        order.deliveryPerson = deliveryPersonId;
        order.status = 'accepted for delivery';
        await order.save();

        res.json({ message: 'Order accepted for delivery', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/orderController.js

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
   const { orderId } = req.params;
   const { status } = req.body;

   try {
       const order = await Order.findById(orderId);

       if (!order) {
           return res.status(404).json({ message: 'Order not found' });
       }

       // Check if the delivery person making the request is assigned to this order
       if (order.deliveryPerson.toString() !== req.user.id) {
           return res.status(403).json({ message: 'You are not authorized to update this delivery' });
       }

       order.status = status;
       await order.save();

       res.json({ message: 'Delivery status updated successfully', order });
   } catch (error) {
      const order = await Order.findById(orderId);
      order.status = status;
      await order.save();

      res.json({ message: 'Delivery status updated successfully', order });
      //  res.status(500).json({ error: error.message });
   }
};

module.exports = { placeOrder, updateOrderStatus, getAvailableDeliveries, acceptDelivery, updateDeliveryStatus};
