// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name: String,
   email: { type: String, unique: true },
   password: String,
   role: { type: String, enum: ['customer', 'restaurant_owner', 'delivery_personnel', 'admin'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
