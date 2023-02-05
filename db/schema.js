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
  }

  input UsernameInput {
    username: String!
    email: String
  }

  type Topping {
    name: String
    quantity: Float!
  }

  type Query {
    getCurrentToppings: [Topping]
    getUser(email: String, id: String): User
  }

  type Mutation {
    removeTopping(name: String): Topping
    addTopping(name: String, quantity: Float): Topping
    updateUsername(input: UsernameInput): User
  }
`;

module.exports = typeDefs;
