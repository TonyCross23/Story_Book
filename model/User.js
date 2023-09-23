const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId : {
        type : String , 
        required : true
    },

    displayName : {
        type : String , 
        required : true
    },

    first_name : {
        type : String , 
        required : true
    },

    last_name : {
        type : String , 
        required : true
    },

    image : {
        type : String , 
    },
    created_at : {
        type : Date , 
        default : Date.now(),
    },
})

module.exports = mongoose.model('User',UserSchema);