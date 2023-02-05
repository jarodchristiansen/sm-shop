import { dateScalar } from "../scalars";
import { ToppingsResolver } from "./toppings";
import { UserResolver } from "./user";
import { PizzaResolver } from "./pizza";

const resolvers = {
  Date: dateScalar,

  Query: {
    ...ToppingsResolver.queries,
    ...UserResolver.queries,
    ...PizzaResolver.queries,
  },

  Mutation: {
    // products
    ...UserResolver.mutations,
    ...ToppingsResolver.mutations,
  },
};

module.exports = resolvers;
