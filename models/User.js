const mongoose = require("mongoose");

const UserSchema = {
  email: {
    unique: true,
    type: String,
  },
  security: {
    hash: String,
    salt: String,
    token: String,
  },
  account: {
    firstName: String,
    lastName: String,
  },
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
