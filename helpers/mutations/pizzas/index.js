import { gql } from "@apollo/client";

export const CREATE_PIZZA = gql`
  mutation createPizza($input: PizzaInput) {
    createPizza(input: $input) {
      name
      ingredients {
        name
        quantity
      }
    }
  }
`;

export const DELETE_PIZZA = gql`
  mutation deletePizza($input: PizzaInput) {
    deletePizza(input: $input) {
      name
      ingredients {
        name
        quantity
      }
    }
  }
`;
