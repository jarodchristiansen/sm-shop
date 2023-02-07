import { MockedProvider } from "@apollo/client/testing";
import { render, fireEvent, screen } from "@testing-library/react";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { UPDATE_TOPPINGS } from "@/helpers/mutations/toppings";
import { CREATE_PIZZA, DELETE_PIZZA } from "@/helpers/mutations/pizzas";

import CreatePizzaForm from ".";
import { ViewConsts } from "@/helpers/consts/views";

const mockCreatePizza = [
  {
    request: {
      query: CREATE_PIZZA,
      variables: {
        input: {
          name: "Grechen",
          ingredients: [
            { name: "Crust Dough", quantity: 1 },
            { name: "Tomato Sauce", quantity: 1 },
          ],
        },
      },
      refetchQueries: [{ query: GET_EXISTING_PIZZAS }, { query: GET_TOPPINGS }],
    },
    result: {
      data: {
        createPizza: {
          name: "Grechen",
          ingredients: [{ name: "Crust Dough", quantity: 1 }],
        },
      },
    },
  },
];

const mockUpdateToppings = [
  {
    request: {
      query: UPDATE_TOPPINGS,
      variables: { input: [] },
      refetchQueries: [{ query: GET_EXISTING_PIZZAS }, { query: GET_TOPPINGS }],
    },
    result: {
      data: {
        updateToppings: null,
      },
    },
  },
];

const getExistingPizzas = [
  {
    request: {
      query: GET_EXISTING_PIZZAS,
      variables: {},
    },
    result: {
      data: {
        getExistingPizzas: [
          {
            __typename: "Pizza",
            name: "Thomas",
            ingredients: [
              {
                __typename: "Topping",
                name: "Crust Dough",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato Sauce",
                quantity: 2,
              },
              {
                __typename: "Topping",
                name: "Mushrooms",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato",
                quantity: 1,
              },
            ],
          },
          {
            __typename: "Pizza",
            name: "Gabe",
            ingredients: [
              {
                __typename: "Topping",
                name: "Crust Dough",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato Sauce",
                quantity: 2,
              },
              {
                __typename: "Topping",
                name: "Sausage",
                quantity: 2,
              },
              {
                __typename: "Topping",
                name: "Bell Peppers",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "French Fries",
                quantity: 1,
              },
            ],
          },
          {
            __typename: "Pizza",
            name: "Joe",
            ingredients: [
              {
                __typename: "Topping",
                name: "Crust Dough",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato Sauce",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Bell Peppers",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato",
                quantity: 1,
              },
            ],
          },
          {
            __typename: "Pizza",
            name: "Greg",
            ingredients: [
              {
                __typename: "Topping",
                name: "Crust Dough",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato Sauce",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Mushrooms",
                quantity: 1,
              },
            ],
          },
          {
            __typename: "Pizza",
            name: "Grechen",
            ingredients: [
              {
                __typename: "Topping",
                name: "Crust Dough",
                quantity: 1,
              },
              {
                __typename: "Topping",
                name: "Tomato Sauce",
                quantity: 1,
              },
            ],
          },
        ],
      },
    },
  },
];

const getToppingsMock = [
  {
    request: {
      query: GET_TOPPINGS,
      fetchPolicy: "cache-and-network",
      variables: {},
    },
    result: {
      data: {
        getCurrentToppings: [
          {
            name: "Crust Dough",
            quantity: 7,
          },
          {
            name: "Tomato Sauce",
            quantity: 7,
          },
          {
            name: "Mushrooms",
            quantity: 4,
          },
          {
            name: "Tomato",
            quantity: 7,
          },
          {
            name: "French Fries",
            quantity: 6,
          },
          {
            name: "Bell Peppers",
            quantity: 3,
          },
          {
            name: "Sausage",
            quantity: 3,
          },
        ],
      },
    },
  },
];

describe("CreatePizzaForm Edit Version", () => {
  let currentPizza = {
    __typename: "Pizza",
    name: "Grechen",
    ingredients: [
      {
        __typename: "Topping",
        name: "Crust Dough",
        quantity: 1,
      },
      {
        __typename: "Topping",
        name: "Tomato Sauce",
        quantity: 1,
      },
    ],
  };

  let existingPizzas = [
    {
      __typename: "Pizza",
      name: "Thomas",
      ingredients: [
        {
          __typename: "Topping",
          name: "Crust Dough",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato Sauce",
          quantity: 2,
        },
        {
          __typename: "Topping",
          name: "Mushrooms",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato",
          quantity: 1,
        },
      ],
    },
    {
      __typename: "Pizza",
      name: "Gabe",
      ingredients: [
        {
          __typename: "Topping",
          name: "Crust Dough",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato Sauce",
          quantity: 2,
        },
        {
          __typename: "Topping",
          name: "Sausage",
          quantity: 2,
        },
        {
          __typename: "Topping",
          name: "Bell Peppers",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "French Fries",
          quantity: 1,
        },
      ],
    },
    {
      __typename: "Pizza",
      name: "Joe",
      ingredients: [
        {
          __typename: "Topping",
          name: "Crust Dough",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato Sauce",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Bell Peppers",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato",
          quantity: 1,
        },
      ],
    },
    {
      __typename: "Pizza",
      name: "Greg",
      ingredients: [
        {
          __typename: "Topping",
          name: "Crust Dough",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato Sauce",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Mushrooms",
          quantity: 1,
        },
      ],
    },
    {
      __typename: "Pizza",
      name: "Grechen",
      ingredients: [
        {
          __typename: "Topping",
          name: "Crust Dough",
          quantity: 1,
        },
        {
          __typename: "Topping",
          name: "Tomato Sauce",
          quantity: 1,
        },
      ],
    },
  ];

  let initializedPizza = {
    __typename: "Pizza",
    name: "Grechen",
    ingredients: [
      {
        __typename: "Topping",
        name: "Crust Dough",
        quantity: 1,
      },
      {
        __typename: "Topping",
        name: "Tomato Sauce",
        quantity: 1,
      },
    ],
  };

  let mocks = [
    ...getToppingsMock,
    ...getExistingPizzas,
    ...mockCreatePizza,
    ...mockUpdateToppings,
  ];

  let setChefView = jest.fn();
  let setCurrentPizza = jest.fn();

  it("Should Render the Existing Pizza when clicking edit", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      </MockedProvider>
    );

    expect(screen.getByDisplayValue("Grechen")).toBeTruthy();
  });

  it("Should call setChefView when clicking main button", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      </MockedProvider>
    );

    let mainViewButton = screen.getByTestId("main-view-button");
    fireEvent.click(mainViewButton);

    expect(setChefView).toBeCalledWith(ViewConsts.chefView.Existing);
  });

  it("Should allow removal of items from currentPizza", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      </MockedProvider>
    );

    let decrementButton = screen.getByTestId("decrement-button-Tomato");
    fireEvent.click(decrementButton);

    expect(setCurrentPizza).toBeCalled();
  });

  it("Should allow adding ingredient to currentPizza", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      </MockedProvider>
    );

    let incrementButton = screen.getByTestId("decrement-button-Tomato");
    fireEvent.click(incrementButton);

    expect(setCurrentPizza).toBeCalled();
  });

  it("Should allow chef to delete existing pizza", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      </MockedProvider>
    );

    let deleteButton = screen.getByTestId("delete-pizza-button");
    fireEvent.click(deleteButton);

    expect(setChefView).toBeCalledWith(ViewConsts.chefView.Existing);
  });

  it("Should submit pizza if no underlying validation issues", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      </MockedProvider>
    );

    let decrementButton = screen.getByTestId("decrement-button-Tomato");
    fireEvent.click(decrementButton);

    let submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    expect(setChefView).toBeCalledWith(ViewConsts.chefView.Existing);
  });
});
