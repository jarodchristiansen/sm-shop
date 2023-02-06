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
