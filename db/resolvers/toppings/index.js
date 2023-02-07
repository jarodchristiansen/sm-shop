import Toppings from "../../models/topping";
import Pizzas from "../../models/pizza";

export const ToppingsResolver = {
  queries: {
    getCurrentToppings: async (_, {}) => {
      try {
        let toppings = await Toppings.find({});

        return toppings;
      } catch (err) {
        return err;
      }
    },
  },
  mutations: {
    addTopping: async (_, { name, quantity }) => {
      try {
        let existingTopping = await Toppings.findOne({ name });

        if (existingTopping) {
          existingTopping.quantity = quantity;
          await existingTopping.save();
          return existingTopping;
        } else {
          let newTopping = new Toppings({ name, quantity });

          let result = await newTopping.save();

          return result;
        }
      } catch (err) {
        return err;
      }
    },

    removeTopping: async (_, { name }) => {
      try {
        let pizzas = await Pizzas.find({});

        for (let pizza of pizzas) {
          for (let ingredient of pizza.ingredients) {
            if (ingredient.name === name) {
              ingredient.remove();
              pizza.save();
            }
          }
        }

        let toppingsList = await Toppings.findOne({ name }).remove();
        return toppingsList;
      } catch (err) {
        return err;
      }
    },

    updateToppings: async (_, { input }) => {
      // Used in create pizza form to manage inventory
      try {
        for (let topping of input) {
          let existingTopping = await Toppings.findOneAndUpdate(
            { name: topping.name },
            { quantity: topping.quantity }
          );
          await existingTopping.save();
        }

        return input;
      } catch (err) {
        return err;
      }
    },
  },
};
