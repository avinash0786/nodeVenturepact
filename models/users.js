var mongoose = require("mongoose");

var userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    profileImage: {
      type: String,
    },
  },
  { collection: "users" }
);

// Compile model from schema
module.exports = mongoose.model("users", userSchema);
