const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String,required: true},
  phone: { type: String, required: true, unique: true },
  countryCode: { type: String,},
  countryName: { type: String,},
  profilePicture: { type: String },
  joindDate: { type: Date, default: Date.now },
  sentFollowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedFollowRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
