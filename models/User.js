// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  lastSync: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;