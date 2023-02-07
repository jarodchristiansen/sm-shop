import mongoose from "mongoose";
import { stringify } from "querystring";

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const UsersSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    trim: false,
  },
  role: {
    type: String,
    trim: false,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

UsersSchema.index({ name: "text" });

module.exports = mongoose.models.User || mongoose.model("User", UsersSchema);
