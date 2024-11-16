const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

const addRestaurant = async (req, res) => {
   try {
      const { name, owner } = req.body;
      const restaurant = new Restaurant({ name, owner });
      await restaurant.save();
      res.status(201).json( {message: 'Restaurant added successfully', restaurant});
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

const addMenuItem = async (req, res) => {
   const { name, price, description } = req.body;
   const restaurant = await Restaurant.findById(req.params.id);
   if (restaurant) {
      restaurant.menu.push({ name, price, description });
      await restaurant.save();
      res.json(restaurant);
   } else {
      res.status(404).json({ message: 'Restaurant not found' });
   }
};

// controllers/restaurantController.js
// View all orders for a specific restaurant
const getOrdersForRestaurant = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    try {
        const orders = await Order.find({ restaurant: restaurantId }).populate('customer', 'name').populate('items.menuItem', 'name');
        res.json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/restaurantController.js

// Update restaurant details
const updateRestaurantDetails = async (req, res) => {
   const restaurantId = req.params.restaurantId;
   const updateData = req.body;

   try {
       const restaurant = await Restaurant.findByIdAndUpdate(
           restaurantId,
           updateData,
           { new: true, runValidators: true }
       );

       if (!restaurant) {
           return res.status(404).json({ message: 'Restaurant not found' });
       }

       res.json({ message: 'Restaurant updated successfully', restaurant });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

module.exports = { addRestaurant, addMenuItem, getOrdersForRestaurant, updateOrderStatus, updateRestaurantDetails};
