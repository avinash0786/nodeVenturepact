var mongoose = require('mongoose');

var userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    address:{
        type:String
    }
},{ collection : 'users' });

// Compile model from schema
module.exports=mongoose.model('users',userSchema);