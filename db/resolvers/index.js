import { dateScalar } from "../scalars";
import { ToppingsResolver } from "./toppings";
import { UserResolver } from "./user";

const resolvers = {
  Date: dateScalar,

  Query: {
    ...ToppingsResolver.queries,
    ...UserResolver.queries,
  },

  Mutation: {
    // products
    ...UserResolver.mutations,
    ...ToppingsResolver.mutations,
  },
};

module.exports = resolvers;
