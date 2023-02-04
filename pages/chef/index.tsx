import React, { useState, useMemo } from "react";
import styled from "styled-components";

const ChefPage = () => {
  const dummyPizas = [
    {
      name: "Cheese Pizza",
      ingredients: [{ name: "Shredded Cheese", quantity: 2 }],
    },
    {
      name: "Pepperoni",
      ingredients: [
        { name: "Shredded Cheese", quantity: 1 },
        { name: "Pepperoni", quantity: 2 },
      ],
    },
  ];

  const [existingPizzas, setExistingPizzas] = useState(dummyPizas);
  const [chefView, setChefView] = useState("Existing");
  const dummyToppings = [
    { name: "Shredded Cheese", quantity: 20 },
    { name: "Pepperoni", quantity: 10 },
  ];

  const [toppingsList, setToppingsList] = useState(dummyToppings);
  const [toppingInput, setToppingInput] = useState("");
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [selectedTopping, setSelectedTopping] = useState("");
  const [currentPizza, setCurrentPizza] = useState([]);
  const [editSelect, setEditSelect] = useState();

  const handleToppingQuantity = (e) => {
    let value = parseInt(e.target.value);

    setToppingQuantity(value);
  };

  const AvailableToppings = useMemo(() => {
    if (!toppingsList.length) return [];

    return toppingsList.map((topping) => {
      return (
        <div key={topping.name}>
          <span>Topping: {topping.name}</span>
          {/* <span>Quantity: {topping.quantity}</span> */}

          <label htmlFor="quantity">Quantity Avail</label>
          <input
            type="number"
            min={0}
            max={topping.quantity}
            name="quantity"
            defaultValue={0}
            onChange={handleToppingQuantity}
          />
          <button onClick={(e) => addIngredientToPizzaList(topping)}>
            Add
          </button>
        </div>
      );
    });
  }, [toppingsList, toppingQuantity]);

  const CurrentPizzaIngredients = useMemo(() => {
    if (!currentPizza.length) return [];

    return currentPizza.map((topping) => {
      return (
        <div key={topping.name}>
          <span>Topping: {topping.name}</span>

          <label htmlFor="quantity">Quantity Avail</label>
          <input
            type="number"
            min={0}
            max={10}
            name="quantity"
            defaultValue={topping.quantity}
            onChange={handleToppingQuantity}
            disabled
          />
          <button onClick={(e) => addIngredientToPizzaList(topping)}>
            Add
          </button>
        </div>
      );
    });
  }, [currentPizza, toppingQuantity]);

  const addIngredientToPizzaList = (topping) => {
    console.log(
      { topping, toppingQuantity },
      "IN ADD INGREDIENT TO PIZZA LIST"
    );

    setCurrentPizza([
      ...currentPizza,
      { name: topping.name, quantity: toppingQuantity },
    ]);
  };

  const ExistingPizzas = useMemo(() => {
    if (!existingPizzas.length) return [];

    return existingPizzas.map((pizza) => {
      return (
        <div key={pizza.name}>
          <span>Pizza: {pizza.name}</span>

          {pizza.ingredients.map((topping) => {
            return (
              <span>
                Ingredient: {topping.name} - (x{topping.quantity})
              </span>
            );
          })}

          <button>Edit</button>
        </div>
      );
    });
  }, [existingPizzas]);

  return (
    <PageContain>
      Chef Page
      {chefView === "Existing" && (
        <div>
          {ExistingPizzas}

          <button onClick={(e) => setChefView("Create")}>
            Make a new Pizza
          </button>
        </div>
      )}
      {chefView === "Create" && (
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
      )}
    </PageContain>
  );
};

const ListsContainer = styled.div`
  display: flex;
  flex-direction: row;
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
