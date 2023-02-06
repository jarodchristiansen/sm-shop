import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { useLazyQuery } from "@apollo/client/react";
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";

const ChefPage = () => {
  const [existingPizzas, setExistingPizzas] = useState([]);
  const [chefView, setChefView] = useState("Existing");
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [currentPizza, setCurrentPizza] = useState<any>([]);
  const [editSelectPizza, setEditSelectPizza] = useState<any>();
  const [toppingsList, setToppingsList] = useState([]);

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

  const handleToppingQuantity = (inputTopping) => {
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
          copyIngredient.quantity--;

          console.log({ copyIngredient });
        }

        return copyIngredient;
      });
    }

    console.log(
      { copyAvailToppings, toppingsList },
      "IN HANDLE TOPPING QUANTITY"
    );

    setToppingsList(copyAvailToppings);

    // TODO: Decrement from the available toppings;

    // setToppingQuantity(value);
  };

  const addIngredientToPizzaList = (topping) => {
    if (currentPizza && currentPizza?.ingredients) {
      let copyPizza = { ...currentPizza };

      let filteredIngredient = copyPizza.ingredients.filter(
        (ingredient) => ingredient.name === topping.name
      );

      if (filteredIngredient.length) {
        // If ingredient already exists
        copyPizza.ingredients = copyPizza.ingredients.map((ingredient) => {
          let copyIngredient = { ...ingredient };

          if (ingredient.name === topping.name) {
            copyIngredient.quantity++;
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
        name: "",
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
              addIngredientToPizzaList(topping);
              handleToppingQuantity(topping);
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
      return (
        <div key={topping.name}>
          <span>Topping: {topping.name}</span>

          <label htmlFor="quantity">quantity</label>

          <button onClick={(e) => addIngredientToPizzaList(topping)}>-</button>

          <span>{topping.quantity}</span>
        </div>
      );
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

  console.log({ currentPizza });

  return (
    <PageContain>
      Chef Page
      {chefView === "Existing" && !editSelectPizza && (
        <>
          {ExistingPizzas}

          <button onClick={(e) => setChefView("Create")}>
            Make a new Pizza
          </button>
        </>
      )}
      {chefView === "Create" && (
        <>
          <button
            onClick={(e) => {
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
              defaultValue={currentPizza?.name}
            />
          </div>

          <ListsContainer>
            <div>
              <h4>Adding Ingredients</h4>
              {AvailableToppings}
            </div>

            <div>
              <h4>Current Pizza</h4>

              {CurrentPizzaIngredients}
            </div>
          </ListsContainer>
        </>
      )}
    </PageContain>
  );
};

const EditPizzaContainer = styled.div``;

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
