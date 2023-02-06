import Pizzas from "../../models/pizza";

export const PizzaResolver = {
  queries: {
    getExistingPizzas: async (_, {}) => {
      try {
        let pizzas = await Pizzas.find({});
        return pizzas;
      } catch (err) {
        return err;
      }
    },
    // getCurrentToppings: async (_, {}) => {
    //   try {
    //     let toppings = await Toppings.find({});
    //     return toppings;
    //   } catch (err) {
    //     return err;
    //   }
    // },
  },
  mutations: {
    // addTopping: async (_, { name, quantity }) => {
    //   try {
    //     let existingTopping = await Toppings.findOne({ name });
    //     if (existingTopping) {
    //       existingTopping.quantity = quantity;
    //       await existingTopping.save();
    //       return existingTopping;
    //     } else {
    //       let newTopping = new Toppings({ name, quantity });
    //       let result = await newTopping.save();
    //       return result;
    //     }
    //   } catch (err) {
    //     console.log({ err });
    //   }
    // },
    // removeTopping: async (_, { name }) => {
    //   try {
    //     let toppingsList = await Toppings.findOne({ name }).remove();
    //     return toppingsList;
    //   } catch (err) {
    //     console.log({ err }, "IN REMOVE TOPPING");
    //   }
    // },
  },
};
