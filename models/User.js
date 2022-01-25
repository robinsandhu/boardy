const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    resetPasswordToken: {type: String, required: false},
    resetPasswordExpires: {type: Date, required: false}
});

module.exports = mongoose.model('User', userSchema);