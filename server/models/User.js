const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, unique: true },
    username: String,
    displayName: String,
    avatar: String,

   
    loginCount: { type: Number, default: 1 },
    lastLogin: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);