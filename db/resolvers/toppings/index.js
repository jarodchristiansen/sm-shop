import Toppings from "../../models/topping";

export const ToppingsResolver = {
  queries: {
    getCurrentToppings: async (_, {}) => {
      console.log("FIRING GET CURRENT TOPPINGS");

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
          console.log({ existingTopping, name, quantity }, "IN ADD TOPPING");
          existingTopping.quantity = quantity;
          await existingTopping.save();
          return existingTopping;
        } else {
          let newTopping = new Toppings({ name, quantity });

          console.log("NOT IN EXISTING TOPPINGS", { newTopping });

          let result = await newTopping.save();

          return result;
        }
      } catch (err) {
        console.log({ err });
      }
    },
    removeTopping: async (_, { name }) => {
      try {
        let toppingsList = await Toppings.find({});

        let filteredList = toppingsList.filter(
          (topping) => topping.name !== name
        );

        let results = filteredList.save();
        return results;
      } catch (err) {
        console.log({ err }, "IN REMOVE TOPPING");
      }
    },
  },
};
