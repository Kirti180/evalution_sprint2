const mongoose = require("mongoose");
userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "user",
    require: true,
    enum: ["user", "seller"],
  },
});
userModel = mongoose.model("users", userSchema);
module.exports = { userModel };
