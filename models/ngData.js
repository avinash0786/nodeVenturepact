var mongoose = require("mongoose");

var ngData = mongoose.Schema(
  {
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    pswd: {
      type: String,
    },
  },
  { collection: "ngData" }
);

// Compile model from schema
module.exports = mongoose.model("ngData", ngData);
