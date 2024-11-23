const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  city: { type: String, required: true },
  blocked: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("users", userSchema);
