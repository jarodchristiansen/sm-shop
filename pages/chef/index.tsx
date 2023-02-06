import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { useLazyQuery } from "@apollo/client/react";
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";

const ChefPage = () => {
  const [existingPizzas, setExistingPizzas] = useState([]);
  const [chefView, setChefView] = useState("Existing");

  const [toppingInput, setToppingInput] = useState("");
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [selectedTopping, setSelectedTopping] = useState("");
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

  const handleToppingQuantity = (e) => {
    let value = parseInt(e.target.value);

    setToppingQuantity(value);
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
          if (ingredient.name === topping.name) {
            ingredient.quantity++;
          }

          return ingredient;
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
            defaultValue={topping.quantity}
            disabled
          />

          <button onClick={(e) => addIngredientToPizzaList(topping)}>+</button>
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
          <span>Pizza: {pizza.name}</span>

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
            <label htmlFor="order_name">Order Name:</label>
            <input
              type="text"
              name="order_name"
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
