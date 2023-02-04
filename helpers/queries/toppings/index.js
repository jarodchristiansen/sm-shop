import { gql } from "apollo-server-micro";

export const GET_TOPPINGS = gql`
  query GET_TOPPINGS {
    getCurrentToppings {
      name
      quantity
    }
  }
`;
