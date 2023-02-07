import styled from "styled-components";
import { UPDATE_TOPPINGS } from "@/helpers/mutations/toppings";
import { CREATE_PIZZA, DELETE_PIZZA } from "@/helpers/mutations/pizzas";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { useEffect, useMemo, useState } from "react";
import { Pizza } from "@/helpers/types";
import LoadingDiv from "@/components/commons/LoadingDiv";
import { MediaQueries } from "@/styles/MediaQueries";
import { ErrorMessages } from "@/helpers/consts/errors";
import { ViewConsts } from "@/helpers/consts/views";
import { IngrdientConsts } from "@/helpers/consts/ingredients";

interface CreatePizzaFormProps {
  currentPizza: Pizza | null;
  setCurrentPizza: (pizza: Pizza | null) => void;
  setChefView: (view: string) => void;
  initializedPizza: Pizza | null;
  existingPizzas: Pizza[] | [];
}

/**
 *
 * @param currentPizza: Existing pizza order in edit, or null in case of create new pizza
 * @param setCurrentPizza: setState call to select current pizza for edit/create
 * @param setChefView: changes the view of chef screen allowing view/edit/create
 * @param initializedPizza: set in case of edit pizza to signify it is existing order rather than new
 * @param existingPizzas: existing orders retrieved from DB
 * @returns Chef Pizza Form allowing view/create/edit/delete of pizzas and viewing topping inventory
 */
const CreatePizzaForm = ({
  currentPizza,
  setCurrentPizza,
  setChefView,
  initializedPizza,
  existingPizzas,
}: CreatePizzaFormProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [toppingsList, setToppingsList] = useState([]);

  const [getToppings, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery(GET_TOPPINGS, {
      fetchPolicy: "cache-and-network",
      variables: {},
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

  useEffect(() => {
    let checkForCrusts = toppingsList.filter(
      (topping) =>
        topping.name.includes(IngrdientConsts.Dough) && topping.quantity < 1
    );

    !!checkForCrusts.length
      ? setErrorMessage(ErrorMessages.NoDough)
      : setErrorMessage("");
  }, [toppingsList, currentPizza?.name]);

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
    setChefView(ViewConsts.chefView.Existing);
    setErrorMessage("");
  };

  const checkForExistingCustomerOrder = (pizzaCopy) => {
    // Checks for name
    let copyNameOfExistingPizza = existingPizzas.filter(
      (pizza: Pizza) => pizza.name == pizzaCopy.name
    );

    return copyNameOfExistingPizza;
  };

  const duplicatedPizzaToppings = (pizzaCopy) => {
    let failedDuplicateChecks = [];
    // Checks for name
    let copyNameOfExistingPizza = existingPizzas.filter(
      (pizza: Pizza) => pizza.name == pizzaCopy.name
    );

    // Check for a pizza with matching ingredients and name
    for (let pizza of copyNameOfExistingPizza) {
      if (pizza?.ingredients.join("") === pizzaCopy?.ingredients.join("")) {
        failedDuplicateChecks.push(pizza);
      }
    }

    return failedDuplicateChecks;
  };

  const handleSubmitPizza = () => {
    // TODO: handle __typename upstream
    let newToppingsList = toppingsList.map((topping) => {
      return { name: topping.name, quantity: topping.quantity };
    });

    //TODO: handle__typename upstream
    let pizzaCopy = { name: "", ingredients: [] };
    pizzaCopy.name = currentPizza?.name;

    pizzaCopy.ingredients = currentPizza?.ingredients?.map((ingredient) => {
      return { name: ingredient.name, quantity: ingredient.quantity };
    });

    // Checks to prevent duplicate orders
    let copyNameOfExistingPizza = checkForExistingCustomerOrder(pizzaCopy);
    let copyOfWholeOrder = duplicatedPizzaToppings(pizzaCopy);

    // Confirms dough is in ingredients as it is required
    let checkForDough = pizzaCopy.ingredients.filter(
      (ingredient) =>
        ingredient.name.includes("Dough") && ingredient.quantity > 0
    );

    if (!checkForDough.length) {
      // If chef doesn't include dough
      setErrorMessage(ErrorMessages.NoCrust);
      return;
    } else if (
      copyOfWholeOrder?.length &&
      pizzaCopy.name !== initializedPizza?.name
    ) {
      // If whole order matches existing order
      setErrorMessage(ErrorMessages.NoDuplicates);
    } else if (
      copyNameOfExistingPizza?.length &&
      pizzaCopy.name !== initializedPizza?.name
    ) {
      // If customer name already in existing pizzas/not initialziedPizza in edit condition
      setErrorMessage(ErrorMessages.NoDuplicateNames);
      return;
    } else if (!pizzaCopy?.name) {
      setErrorMessage(ErrorMessages.NoCustomer);
      return;
    } else {
      // Updates toppings while creating pizza to manage total inventory
      updateToppings({ variables: { input: newToppingsList } });
      createPizza({ variables: { input: pizzaCopy } });
      setChefView(ViewConsts.chefView.Existing);
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
        <div key={topping.name} className="topping-row">
          <span>{topping.name} </span>

          <div className="quantity-input-container">
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
            data-testid={`increment-button-${topping.name.split(" ")[0]}`}
            onClick={(e) => handleIngredientInventory(topping, "increment")}
            disabled={topping.quantity === 0}
          >
            +
          </button>
        </div>
      );
    });
  }, [toppingsList, currentPizza]);

  const CurrentPizzaIngredients = useMemo(() => {
    if (!currentPizza?.ingredients?.length) return [];

    return currentPizza.ingredients.map((topping) => {
      if (topping.quantity) {
        return (
          <div key={topping.name} className="topping-row">
            <div>
              <span data-testid="ingredient-name">{topping.name}</span>
            </div>

            <div className="quantity-input-container">
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
              data-testid={`decrement-button-${topping.name.split(" ")[0]}`}
              onClick={(e) => handleIngredientInventory(topping, "decrement")}
              disabled={topping.quantity === 0}
            >
              -
            </button>
          </div>
        );
      }
    });
  }, [currentPizza, toppingsList]);

  const resetToMainChefPage = () => {
    setErrorMessage("");
    setCurrentPizza(null);
    setChefView(ViewConsts.chefView.Existing);
  };

  return (
    <CreateContainer>
      <button
        data-testid="main-view-button"
        onClick={(e) => resetToMainChefPage()}
      >
        See Existing Pizzas
      </button>

      <div>
        <label htmlFor="customer_name">Customer:</label>
        <input
          id="customer-name-input"
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
              <div className="toppings-table">
                <h4>Available Ingredients</h4>
                {AvailableToppings}
              </div>

              <div className="toppings-table">
                <h4>Current Pizza</h4>

                {CurrentPizzaIngredients}
              </div>
            </ListsContainer>
          </>
        )}

      {errorMessage && (
        <div>
          <h4 className="error-message" data-testid="error-message">
            {errorMessage}
          </h4>
        </div>
      )}

      <div>
        <button data-testid="delete-pizza-button" onClick={handleDeletePizza}>
          Delete
        </button>
        <button data-testid="submit-button" onClick={handleSubmitPizza}>
          Save
        </button>
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
  flex-direction: column;
  gap: 2rem;

  .toppings-table {
    border: 2px solid black;
    padding: 2rem;
    width: 100%;

    .topping-row {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid gray;
      align-items: center;
      padding: 1rem;
      gap: 0.5rem;

      .quantity-input-container {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
      }
    }
  }

  @media ${MediaQueries.MD} {
    flex-direction: row;
  }
`;

export default CreatePizzaForm;
