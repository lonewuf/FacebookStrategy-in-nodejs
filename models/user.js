const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  facebook_id: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", userSchema);
