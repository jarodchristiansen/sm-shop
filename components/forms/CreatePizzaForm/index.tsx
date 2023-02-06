import styled from "styled-components";
import { UPDATE_TOPPINGS } from "@/helpers/mutations/toppings";
import { CREATE_PIZZA, DELETE_PIZZA } from "@/helpers/mutations/pizzas";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { useEffect, useMemo, useState } from "react";

const CreatePizzaForm = ({
  currentPizza,
  setCurrentPizza,
  setChefView,
  initializedPizza,
}: any) => {
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toppingsList, setToppingsList] = useState([]);

  const [getToppings, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery(GET_TOPPINGS, {
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
  }, []);

  useEffect(() => {
    if (data?.getCurrentToppings) {
      setToppingsList(data.getCurrentToppings);
    }
  }, [data]);

  const handleToppingQuantity = (inputTopping, step) => {
    let copyAvailToppings = [...toppingsList];

    let filteredList = copyAvailToppings.filter(
      (topping) => topping.name === inputTopping.name
    );

    if (filteredList.length) {
      copyAvailToppings = copyAvailToppings.map((ingredient) => {
        let copyIngredient = { ...ingredient };

        if (ingredient.name === inputTopping.name) {
          // TODO: Make this more intuitive due to inversion
          step === "increment"
            ? copyIngredient.quantity--
            : copyIngredient.quantity++;
        }

        return copyIngredient;
      });
    }

    setToppingsList(copyAvailToppings);

    // TODO: Decrement from the available toppings;

    // setToppingQuantity(value);
  };

  const handleDeletePizza = async () => {
    let pizzaCopy = { name: "", ingredients: [] };
    pizzaCopy.name = currentPizza.name;

    pizzaCopy.ingredients = currentPizza.ingredients?.map((ingredient) => {
      return { name: ingredient.name, quantity: ingredient.quantity };
    });

    await deletePizza({ variables: { input: pizzaCopy } });
    setChefView("Existing");
    setErrorMessage("");
  };

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

  return (
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
  );
};

const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
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

export default CreatePizzaForm;
