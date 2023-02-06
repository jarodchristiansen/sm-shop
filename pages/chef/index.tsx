import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";
import { UPDATE_TOPPINGS } from "@/helpers/mutations/toppings";
import { CREATE_PIZZA, DELETE_PIZZA } from "@/helpers/mutations/pizzas";

const ChefPage = () => {
  const [existingPizzas, setExistingPizzas] = useState([]);
  const [chefView, setChefView] = useState("Existing");
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [currentPizza, setCurrentPizza] = useState<any>([]);
  const [initializedPizza, setInitializedPizza] = useState<any>({});

  const [toppingsList, setToppingsList] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [getToppings, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery(GET_TOPPINGS, {
      fetchPolicy: "cache-and-network",
    });

  const [
    getExistingPizzas,
    {
      data: pizzaData,
      loading: pizzasLoading,
      error: pizzasError,
      refetch: refetchPizzas,
      fetchMore: fetchMorePizzas,
    },
  ] = useLazyQuery(GET_EXISTING_PIZZAS, {
    fetchPolicy: "cache-and-network",
  });

  const [
    updateToppings,
    { loading: updateToppingsLoading, error: updateToppingsError },
  ] = useMutation(UPDATE_TOPPINGS, {
    refetchQueries: [{ query: GET_EXISTING_PIZZAS }, { query: GET_TOPPINGS }],
  });

  const [
    createPizza,
    { loading: createPizzaLoading, error: createPizzaError },
  ] = useMutation(CREATE_PIZZA, {
    refetchQueries: [{ query: GET_EXISTING_PIZZAS }, { query: GET_TOPPINGS }],
  });

  const [
    deletePizza,
    { loading: deletePizzaLoading, error: deletePizzaError },
  ] = useMutation(DELETE_PIZZA, {
    refetchQueries: [{ query: GET_EXISTING_PIZZAS }, { query: GET_TOPPINGS }],
  });

  useEffect(() => {
    getToppings();
    getExistingPizzas();
  }, []);

  useEffect(() => {
    if (data?.getCurrentToppings) {
      setToppingsList(data.getCurrentToppings);
    }
  }, [data]);

  useEffect(() => {
    if (pizzaData?.getExistingPizzas) {
      setExistingPizzas(pizzaData.getExistingPizzas);
    }
  }, [pizzaData]);

  const handleToppingQuantity = (inputTopping, step) => {
    console.log({ toppingsList, inputTopping }, "IN HANDLE TOPPING QUANTITY");

    let copyAvailToppings = [...toppingsList];

    let filteredList = copyAvailToppings.filter(
      (topping) => topping.name === inputTopping.name
    );

    if (filteredList.length) {
      console.log({ toppingsList, copyAvailToppings });

      copyAvailToppings = copyAvailToppings.map((ingredient) => {
        let copyIngredient = { ...ingredient };

        if (ingredient.name === inputTopping.name) {
          // TODO: Make this more intuitive due to inversion
          step === "increment"
            ? copyIngredient.quantity--
            : copyIngredient.quantity++;

          console.log({ copyIngredient });
        }

        return copyIngredient;
      });
    }

    setToppingsList(copyAvailToppings);

    // TODO: Decrement from the available toppings;

    // setToppingQuantity(value);
  };

  const updateIngredientOnCurrentPizza = (topping, step) => {
    if (currentPizza && currentPizza?.ingredients) {
      let copyPizza = { ...currentPizza };

      let filteredIngredient = copyPizza.ingredients.filter(
        (ingredient) => ingredient.name === topping.name
      );

      if (filteredIngredient.length) {
        // If ingredient already exists
        // TODO: ADD number boundaries min/max on adjustments
        copyPizza.ingredients = copyPizza.ingredients.map((ingredient) => {
          let copyIngredient = { ...ingredient };

          if (ingredient.name === topping.name) {
            step === "increment"
              ? copyIngredient.quantity++
              : copyIngredient.quantity--;
          }

          return copyIngredient;
        });

        setCurrentPizza({
          ...copyPizza,
        });
      } else {
        setCurrentPizza({
          name: currentPizza.name,
          ingredients: [
            ...currentPizza?.ingredients,
            { name: topping.name, quantity: 1 },
          ],
        });
      }
    } else {
      // In create new pizza case
      setCurrentPizza({
        name: currentPizza?.name,
        ingredients: [{ name: topping.name, quantity: 1 }],
      });
    }
  };

  const AvailableToppings = useMemo(() => {
    console.log({ toppingsList }, "IN AVAILABLE TOPPINGS");

    if (!toppingsList.length) return [];

    return toppingsList.map((topping) => {
      return (
        <div key={topping.name}>
          <span>Topping: {topping.name}</span>

          <label htmlFor="quantity">Quantity Avail</label>
          <input
            type="number"
            min={0}
            max={topping.quantity}
            name="quantity"
            value={topping.quantity}
            // defaultValue={topping.quantity}
            disabled
          />

          <button
            onClick={(e) => {
              updateIngredientOnCurrentPizza(topping, "increment");
              handleToppingQuantity(topping, "increment");
            }}
            disabled={topping.quantity === 0}
          >
            +
          </button>
        </div>
      );
    });
  }, [toppingsList, toppingQuantity, currentPizza]);

  const CurrentPizzaIngredients = useMemo(() => {
    if (!currentPizza?.ingredients?.length) return [];

    return currentPizza.ingredients.map((topping) => {
      if (topping.quantity) {
        return (
          <div key={topping.name}>
            <span>Topping: {topping.name}</span>

            <label htmlFor="quantity">quantity</label>

            <button
              onClick={(e) => {
                updateIngredientOnCurrentPizza(topping, "decrement");
                handleToppingQuantity(topping, "decrement");
              }}
              disabled={topping.quantity === 0}
            >
              -
            </button>

            <span>{topping.quantity}</span>
          </div>
        );
      }
    });
  }, [currentPizza, toppingQuantity, toppingsList]);

  const ExistingPizzas = useMemo(() => {
    if (!existingPizzas.length) return [];

    return existingPizzas.map((pizza) => {
      return (
        <PizzaRow key={pizza.name}>
          <span>Customer: {pizza.name}</span>

          <div className="ingredient-column">
            {pizza?.ingredients.map((topping) => {
              return (
                <span>
                  {topping.name} - (x{topping.quantity})
                </span>
              );
            })}
          </div>

          <button
            onClick={(e) => {
              setInitializedPizza(pizza);
              setCurrentPizza(pizza);
              setChefView("Create");
            }}
          >
            Edit
          </button>
        </PizzaRow>
      );
    });
  }, [existingPizzas]);

  const handleSubmitPizza = () => {
    let newToppingsList = toppingsList.map((topping) => {
      return { name: topping.name, quantity: topping.quantity };
    });

    let pizzaCopy = { name: "", ingredients: [] };
    pizzaCopy.name = currentPizza.name;

    pizzaCopy.ingredients = currentPizza.ingredients.map((ingredient) => {
      return { name: ingredient.name, quantity: ingredient.quantity };
    });

    let nonExistingIngredients = pizzaCopy.ingredients.filter(
      (ingredient) => ingredient.quantity < 1
    );

    if (!pizzaCopy?.name) {
      setErrorMessage("NO CUSTOMER NAME CREATED");

      return;
    } else if (nonExistingIngredients.length === pizzaCopy.ingredients.length) {
      setErrorMessage(
        "ATTEMPTING TO SAVE PIZZA WITHOUT INGREDIENTS, PLEASE DELETE INSTEAD"
      );

      updateToppings({ variables: { input: newToppingsList } });

      return;
    } else {
      updateToppings({ variables: { input: newToppingsList } });
      createPizza({ variables: { input: pizzaCopy } });
      setChefView("Existing");
      setErrorMessage("");
    }
  };

  const handleDeletePizza = async () => {
    console.log({ currentPizza }, "IN HANDLE DELETE PIZZA");

    let pizzaCopy = { name: "", ingredients: [] };
    pizzaCopy.name = currentPizza.name;

    pizzaCopy.ingredients = currentPizza.ingredients?.map((ingredient) => {
      return { name: ingredient.name, quantity: ingredient.quantity };
    });

    await deletePizza({ variables: { input: pizzaCopy } });
    setChefView("Existing");
    setErrorMessage("");
  };

  return (
    <PageContain>
      Chef Page
      {chefView === "Existing" && (
        <>
          {ExistingPizzas}

          <button
            onClick={(e) => {
              setCurrentPizza([]);
              setInitializedPizza([]);
              setChefView("Create");
              setErrorMessage("");
            }}
          >
            Make a new Pizza
          </button>
        </>
      )}
      {chefView === "Create" && (
        <CreateContainer>
          <button
            onClick={(e) => {
              setErrorMessage("");
              setCurrentPizza([]);
              setChefView("Existing");
            }}
          >
            See Existing Pizzas
          </button>

          <div>
            <label htmlFor="customer_name">Customer:</label>
            <input
              type="text"
              name="customer_name"
              defaultValue={initializedPizza?.name}
              onChange={(e) => {
                setCurrentPizza({
                  name: e.target.value,
                  ingredients: currentPizza.ingredients,
                });
              }}
              disabled={!!initializedPizza?.name}
            />
          </div>

          <ListsContainer>
            <div className="available-toppings-table">
              <h4>Adding Ingredients</h4>
              {AvailableToppings}
            </div>

            <div className="current-pizza-table">
              <h4>Current Pizza</h4>

              {CurrentPizzaIngredients}
            </div>
          </ListsContainer>

          <div>
            <h4>{errorMessage}</h4>
          </div>

          <div>
            <button onClick={handleDeletePizza}>Delete</button>
            <button onClick={handleSubmitPizza}>Save</button>
          </div>
        </CreateContainer>
      )}
    </PageContain>
  );
};

const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
`;

const PizzaRow = styled.div`
  display: flex;
  flex-direction: row;
  border: 2px solid black;
  width: 100%;
  max-width: 50rem;
  justify-content: space-between;
  padding: 1rem 2rem;
  align-items: center;

  .ingredient-column {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 0 1rem;
    border-left: 1px solid black;
    border-right: 1px solid black;
  }
`;

const ListsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  .available-toppings-table {
    border: 2px solid black;
    padding: 2rem;

    div {
      border-top: 1px solid gray;
    }
  }

  .current-pizza-table {
    border: 2px solid black;
    padding: 2rem;

    div {
      border-top: 1px solid gray;
    }
  }
`;

const PageContain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
`;

export default ChefPage;
