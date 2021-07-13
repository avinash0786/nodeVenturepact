var mongoose = require('mongoose');

var emailSchema=mongoose.Schema({
    date:{
        type:Date,
        default:Date.now()
    },
    reciever:{
        type:String,
    },
    message:{
        type:String
    }
},{ collection : 'emails' });

// Compile model from schema
module.exports=mongoose.model('emails',emailSchema);