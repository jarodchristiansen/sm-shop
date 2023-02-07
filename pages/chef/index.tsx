import { useLazyQuery } from "@apollo/client/react";
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { GET_EXISTING_PIZZAS } from "@/helpers/queries/pizzas";
import CreatePizzaForm from "@/components/forms/CreatePizzaForm";
import { Pizza } from "@/helpers/types";
import LoadingDiv from "@/components/commons/LoadingDiv";
import { ViewConsts } from "@/helpers/consts/views";
import { MediaQueries } from "@/styles/MediaQueries";

/**
 *
 * @returns Chef Page allowing chef role to edit existing pizzas/create new ones
 */
const ChefPage = () => {
  const [existingPizzas, setExistingPizzas] = useState([]);
  const [chefView, setChefView] = useState(ViewConsts.chefView.Existing);
  const [currentPizza, setCurrentPizza] = useState<Pizza | null>(null);
  const [initializedPizza, setInitializedPizza] = useState<Pizza | null>(null);

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
    getExistingPizzas();
  }, []);

  useEffect(() => {
    if (pizzaData?.getExistingPizzas) {
      setExistingPizzas(pizzaData.getExistingPizzas);
    }
  }, [pizzaData]);

  const startNewPizza = () => {
    setCurrentPizza(null);
    setInitializedPizza(null);
    setChefView(ViewConsts.chefView.Create);
  };

  const editExistingPizza = (pizza) => {
    setInitializedPizza(pizza);
    setCurrentPizza(pizza);
    setChefView(ViewConsts.chefView.Create);
  };

  const ExistingPizzas = useMemo(() => {
    if (!existingPizzas.length) return [];

    return existingPizzas.map((pizza) => {
      return (
        <PizzaRow key={pizza.name}>
          <span>Customer: {pizza.name}</span>

          <div className="ingredient-column">
            {pizza?.ingredients.map((topping) => {
              return (
                <span key={topping.name}>
                  {topping.name} - (x{topping.quantity})
                </span>
              );
            })}
          </div>

          <button onClick={(e) => editExistingPizza(pizza)}>Edit</button>
        </PizzaRow>
      );
    });
  }, [existingPizzas]);

  return (
    <PageContain>
      <h1>Chef Page</h1>

      {chefView === "Existing" && pizzasLoading && <LoadingDiv />}

      {chefView === "Existing" && ExistingPizzas && (
        <ExistingPizzasContainer>
          <div className="list-container">{ExistingPizzas}</div>

          <button onClick={(e) => startNewPizza()}>Make a new Pizza</button>
        </ExistingPizzasContainer>
      )}

      {chefView === "Create" && (
        <CreatePizzaForm
          currentPizza={currentPizza}
          setCurrentPizza={setCurrentPizza}
          setChefView={setChefView}
          initializedPizza={initializedPizza}
          existingPizzas={existingPizzas}
        />
      )}
    </PageContain>
  );
};

const ExistingPizzasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;

  .list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;

    @media ${MediaQueries.MD} {
      max-width: 60rem;
    }
  }
`;

const PizzaRow = styled.div`
  display: flex;
  flex-direction: row;
  border: 2px solid black;
  width: 100%;
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

  button {
    margin-left: 2rem;

    @media ${MediaQueries.MD};
  }
`;

const PageContain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;

  button {
    background-color: gray;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 5px;

    :disabled {
      cursor: not-allowed;
    }
  }
`;

export default ChefPage;
