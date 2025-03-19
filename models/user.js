//IMPORT MONGOOSE
const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    fullName:{
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        required:true
    },
    password:{
        type: String,
        required: true,
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isSuperAdmin:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },

}, {timestamps: true});

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;