var mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err => {
    if (err)
        console.log("Error in DB connection");
    else
        console.log("DB connection success...");
}));

mongoose.connection.on('error',console.error.bind(console, 'MongoDB connection error:'))