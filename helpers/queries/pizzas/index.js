const { gql } = require("apollo-server-micro");

export const GET_EXISTING_PIZZAS = gql`
  query GET_EXISTING_PIZZAS {
    getExistingPizzas {
      name
      ingredients {
        name
        quantity
      }
    }
  }
`;
