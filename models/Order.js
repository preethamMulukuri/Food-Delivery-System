// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
   customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
   items: [{
      menuItem: String,
      quantity: Number
   }],
   status: { type: String, enum: ['placed', 'accepted', 'delivering', 'completed', 'preparing', 
      'ready for delivery', 'accepted for delivery', 'en route'], default: 'placed' },
   deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Order', OrderSchema);
