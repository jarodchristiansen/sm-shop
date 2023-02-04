import mongoose from "mongoose";

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const ToppingSchema = new Schema({
  name: {
    type: String,
    trim: false,
  },
  quantity: {
    type: Number,
    trim: false,
  },
});

ToppingSchema.index({ name: "text" });

module.exports =
  mongoose.models.Toppings || mongoose.model("Toppings", ToppingSchema);
