import Pizzas from "../../models/pizza";
import Toppings from "../../models/topping";

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
  },
  mutations: {
    createPizza: async (_, { input }) => {
      try {
        let pizza = await Pizzas.findOne({ name: input.name });

        if (pizza) {
          pizza.name = input.name;
          pizza.ingredients = input.ingredients;

          pizza.ingredients = pizza.ingredients.filter(
            (ingredient) => ingredient.quantity > 0
          );

          pizza.save();

          return pizza;
        } else {
          let newPizza = new Pizzas(input);
          newPizza.save();
          return newPizza;
        }
      } catch (err) {
        return err;
      }
    },

    deletePizza: async (_, { input }) => {
      try {
        for (let topping of input.ingredients) {
          let existingTopping = await Toppings.findOne({ name: topping.name });

          if (existingTopping) {
            existingTopping.quantity =
              existingTopping.quantity + topping.quantity;

            await existingTopping.save();
          }
        }

        await Pizzas.findOne({ name: input.name }).remove();

        return input;
      } catch (err) {
        return err;
      }
    },
  },
};
