// models/Restaurant.js
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
   name: String,
   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   menu: [{
      name: String,
      price: Number,
      description: String,
   }]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
