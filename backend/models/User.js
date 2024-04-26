const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:String,
        required:true,
        unique:true
    },
    aadhaar:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})
const user = mongoose.model('User',userschema);
module.exports = user;