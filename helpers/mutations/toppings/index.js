import { gql } from "@apollo/client";

export const REMOVE_TOPPING = gql`
  mutation removeTopping($name: String) {
    removeTopping(name: $name) {
      name
    }
  }
`;

export const ADD_TOPPING = gql`
  mutation addTopping($name: String, $quantity: Float) {
    addTopping(name: $name, quantity: $quantity) {
      name
      quantity
    }
  }
`;
