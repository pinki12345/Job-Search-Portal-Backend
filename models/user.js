const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    agreedToTerms: {
        type: Boolean,
        required: true,
        default: false
    }
    
})

const User = mongoose.model('User', userSchema);
module.exports = User;