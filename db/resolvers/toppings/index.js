import Toppings from "../../models/topping";

export const ToppingsResolver = {
  queries: {
    getCurrentToppings: async (_, {}) => {
      console.log("FIRING GET CURRENT TOPPINGS");

      try {
        let toppings = await Toppings.find({});

        console.log({ toppings }, "AFTER SEARCH");

        return toppings;
      } catch (err) {
        return err;
      }
    },
  },
  // mutations: {
  //   addTopping: async (_, { name, quantity }) => {
  //     try {
  //       let existingTopping = await Toppings.findOne({ name });

  //       if (existingTopping) {
  //         console.log({ existingTopping }, "IN ADD TOPPING");
  //       } else {
  //         console.log("NOT IN EXISTING TOPPINGS", { name, quantity });
  //       }
  //     } catch (err) {
  //       console.log({ err });
  //     }
  //   },
  // },
};
