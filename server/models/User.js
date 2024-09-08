const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    profileImage: { type: String },
    Created_on: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
