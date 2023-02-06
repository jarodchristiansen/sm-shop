import mongoose from "mongoose";

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const PizzaSchema = new Schema({
  name: {
    type: String,
    trim: false,
  },
  ingredients: {
    type: [{ name: String, quantity: Number }],
    trim: false,
  },
});

PizzaSchema.index({ name: "text" });

module.exports =
  mongoose.models.Pizzas || mongoose.model("Pizzas", PizzaSchema);
