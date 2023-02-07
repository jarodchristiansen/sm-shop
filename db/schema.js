import { gql } from "apollo-server-micro";

const typeDefs = gql`
  scalar Date

  # Products
  type Product {
    id: ID
    name: String
    productionCapacity: Int
    price: Float
    description: String
  }

  input ProductInput {
    name: String!
    productionCapacity: Int!
    price: Float!
    description: String
  }

  type User {
    id: ID
    email: String
    name: String
    username: String
    image: String
    createAt: Date
    role: String
  }

  type Topping {
    name: String
    quantity: Float
  }

  type Pizza {
    name: String
    ingredients: [Topping]
  }

  input ToppingsInput {
    name: String
    quantity: Float
  }

  input PizzaInput {
    name: String
    ingredients: [ToppingsInput]
  }

  type Query {
    getExistingPizzas: [Pizza]
    getCurrentToppings: [Topping]
    getUser(email: String, id: String): User
  }

  type Mutation {
    deletePizza(input: PizzaInput): Pizza
    createPizza(input: PizzaInput): Pizza
    updateToppings(input: [ToppingsInput]): [Topping]
    removeTopping(name: String): Topping
    addTopping(name: String, quantity: Float): Topping
  }
`;

module.exports = typeDefs;
