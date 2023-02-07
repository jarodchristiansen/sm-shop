import styled from "styled-components";
import { UPDATE_TOPPINGS } from "@/helpers/mutations/toppings";
import { CREATE_PIZZA, DELETE_PIZZA } from "@/helpers/mutations/pizzas";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { useEffect, useMemo, useState } from "react";
import { Pizza } from "@/helpers/types";
import LoadingDiv from "@/components/commons/LoadingDiv";

interface CreatePizzaFormProps {
  currentPizza: Pizza | null;
  setCurrentPizza: (pizza: Pizza | null) => void;
  setChefView: (view: string) => void;
  initializedPizza: Pizza | null;
  existingPizzas: Pizza[] | [];
}

const CreatePizzaForm = ({
  currentPizza,
  setCurrentPizza,
  setChefView,
  initializedPizza,
  existingPizzas,
}: CreatePizzaFormProps) => {
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [toppingsList, setToppingsList] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);

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
    // Handles store toppings available to maintain inventory

    let copyAvailToppings = [...toppingsList];

    let filteredList = copyAvailToppings.filter(
      (topping) => topping.name === inputTopping.name
    );

    // Checks for existing ingredient, adds/removes accordingly
    if (filteredList.length) {
      copyAvailToppings = copyAvailToppings.map((ingredient) => {
        let copyIngredient = { ...ingredient };

        if (ingredient.name === inputTopping.name) {
          step === "increment"
            ? copyIngredient.quantity--
            : copyIngredient.quantity++;
        }

        return copyIngredient;
      });
    }

    setToppingsList(copyAvailToppings);
  };

  const handleDeletePizza = async () => {
    let pizzaCopy = { name: "", ingredients: [] };

    if (currentPizza?.name) {
      pizzaCopy.name = currentPizza.name;
    }

    pizzaCopy.ingredients = currentPizza.ingredients?.map((ingredient) => {
      return { name: ingredient.name, quantity: ingredient.quantity };
    });

    await deletePizza({ variables: { input: pizzaCopy } });
    setChefView("Existing");
    setErrorMessage("");
  };

  const handleSubmitPizza = () => {
    // TODO: handle __typename upstream
    // Creates new copy of toppingslist to remove __typename
    let newToppingsList = toppingsList.map((topping) => {
      return { name: topping.name, quantity: topping.quantity };
    });

    //TODO: handle__typename upstream
    // Creates new copy of currentPizza to remove __typename in ingredients
    let pizzaCopy = { name: "", ingredients: [] };
    pizzaCopy.name = currentPizza?.name;

    pizzaCopy.ingredients = currentPizza?.ingredients?.map((ingredient) => {
      return { name: ingredient.name, quantity: ingredient.quantity };
    });

    // Checks if user deletes all items on current pizza and attempts submit
    let nonExistingIngredients = pizzaCopy.ingredients?.filter(
      (ingredient) => ingredient.quantity < 1
    );

    let copyNameOfExistingPizza = existingPizzas.filter(
      (pizza: Pizza) => pizza.name == pizzaCopy.name
    );

    let checkForDough = pizzaCopy.ingredients.filter(
      (ingredient) =>
        ingredient.name.includes("Dough") && ingredient.quantity > 0
    );

    // If chef doesn't include dough
    if (!checkForDough.length) {
      setErrorMessage("MUST USE DOUGH FOR CRUST");
      return;
    }

    // If customer name already in existing pizzas/not initialziedPizza in edit condition
    if (
      copyNameOfExistingPizza?.length &&
      pizzaCopy.name !== initializedPizza?.name
    ) {
      setErrorMessage(
        "CANNOT CREATE DUPLICATE OF EXISTING PIZZA, PLEASE CHANGE CUSTOMER NAME TO ACCOMODATE"
      );
      return;
    }

    if (!pizzaCopy?.name) {
      setErrorMessage("NO CUSTOMER NAME CREATED");

      return;
    } else if (
      nonExistingIngredients?.length === pizzaCopy?.ingredients?.length
    ) {
      setErrorMessage(
        "ATTEMPTING TO SAVE PIZZA WITHOUT INGREDIENTS, PLEASE ADD INGREDIENTS OR USE THE DELETE KEY"
      );

      updateToppings({ variables: { input: newToppingsList } });

      return;
    } else {
      // Updates toppings while creating pizza to manage total inventory
      updateToppings({ variables: { input: newToppingsList } });
      createPizza({ variables: { input: pizzaCopy } });
      setChefView("Existing");
      setErrorMessage("");
    }
  };

  const updateIngredientOnCurrentPizza = (topping, step) => {
    if (currentPizza && currentPizza?.ingredients) {
      let copyPizza = { ...currentPizza };

      // Check if ingredient is already on pizza
      let filteredIngredient = copyPizza.ingredients.filter(
        (ingredient) => ingredient.name === topping.name
      );

      // If ingredient already on current pizza
      if (filteredIngredient.length) {
        copyPizza.ingredients = copyPizza.ingredients.map((ingredient) => {
          let copyIngredient = { ...ingredient };

          // Increment/decrement currentPizza accordingly based on button input
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
        // If ingredient isn't on pizza, add new line item for it
        setCurrentPizza({
          name: currentPizza.name,
          ingredients: [
            ...currentPizza?.ingredients,
            { name: topping.name, quantity: 1 },
          ],
        });
      }
    } else {
      // If no current pizza, ie Creating new pizza
      setCurrentPizza({
        name: currentPizza?.name,
        ingredients: [{ name: topping.name, quantity: 1 }],
      });
    }
  };

  const handleIngredientInventory = (topping, step) => {
    setErrorMessage("");

    updateIngredientOnCurrentPizza(topping, step);
    handleToppingQuantity(topping, step);
  };

  const AvailableToppings = useMemo(() => {
    if (!toppingsList.length) return [];

    return toppingsList.map((topping) => {
      return (
        <div key={topping.name} className="available-topping-row">
          <span>Topping: {topping.name} </span>

          <div>
            <label htmlFor="quantity">x</label>
            <input
              type="number"
              min={0}
              max={topping.quantity}
              name="quantity"
              value={topping.quantity}
              disabled
            />
          </div>

          <button
            onClick={(e) => handleIngredientInventory(topping, "increment")}
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

            <label htmlFor="quantity">x</label>

            <button
              onClick={(e) => handleIngredientInventory(topping, "decrement")}
              disabled={topping.quantity === 0}
            >
              -
            </button>

            <input
              type="number"
              min={0}
              max={topping.quantity}
              name="quantity"
              value={topping.quantity}
              disabled
            />
          </div>
        );
      }
    });
  }, [currentPizza, toppingQuantity, toppingsList]);

  const resetToMainChefPage = () => {
    setErrorMessage("");
    setCurrentPizza(null);
    setChefView("Existing");
  };

  return (
    <CreateContainer>
      <button onClick={(e) => resetToMainChefPage()}>
        See Existing Pizzas
      </button>

      <div>
        <label htmlFor="customer_name">Customer:</label>
        <input
          type="text"
          name="customer_name"
          defaultValue={initializedPizza?.name}
          onChange={(e) => {
            errorMessage && setErrorMessage("");
            setCurrentPizza({
              name: e.target.value,
              ingredients: currentPizza?.ingredients,
            });
          }}
          disabled={!!initializedPizza?.name}
        />
      </div>

      {(loading || updateToppingsLoading || createPizzaLoading) && (
        <LoadingDiv />
      )}

      {AvailableToppings &&
        CurrentPizzaIngredients &&
        (!loading || !updateToppingsLoading || !createPizzaLoading) && (
          <>
            <span>1 Crust Dough is the only required ingredient</span>
            <ListsContainer>
              <div className="available-toppings-table">
                <h4>Available Ingredients</h4>
                {AvailableToppings}
              </div>

              <div className="current-pizza-table">
                <h4>Current Pizza</h4>

                {CurrentPizzaIngredients}
              </div>
            </ListsContainer>
          </>
        )}

      {errorMessage && (
        <div>
          <h4 className="error-message">{errorMessage}</h4>
        </div>
      )}

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

  .error-message {
    color: red;
  }
`;

const ListsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  .available-toppings-table {
    border: 2px solid black;
    padding: 2rem;

    .available-topping-row {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid gray;
      align-items: center;
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
