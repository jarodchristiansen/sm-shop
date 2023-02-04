import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";

import { useLazyQuery } from "@apollo/client";

const ManagerPage = () => {
  const dummyToppings = [
    { name: "Shredded Cheese", quantity: 20 },
    { name: "Pepperoni", quantity: 10 },
  ];

  const [toppingsList, setToppingsList] = useState(dummyToppings);
  const [toppingInput, setToppingInput] = useState("");
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [selectedTopping, setSelectedTopping] = useState("");

  const [getToppings, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery(GET_TOPPINGS, {
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    getToppings();
  }, []);

  useEffect(() => {
    if (data?.getCurrentToppings) {
      setToppingsList(data.getCurrentToppings);
    }
  }, [data]);

  const ToppingsItems = useMemo(() => {
    if (!toppingsList.length) return [];

    return toppingsList.map((topping) => {
      return (
        <div key={topping.name}>
          {topping.name !== selectedTopping ? (
            <>
              <span>Topping: {topping.name}</span>
              <span>Quantity: {topping.quantity}</span>
              <button onClick={(e) => handleEditField(topping)}>Edit</button>
            </>
          ) : (
            <>
              <label htmlFor="topping_name">Topping Name</label>
              <input
                type="text"
                name="topping_name"
                defaultValue={topping.name}
              />

              <label htmlFor="quantity">Quantity Avail</label>
              <input
                type="number"
                min={1}
                max={100}
                name="quantity"
                defaultValue={topping.quantity}
              />

              <button onClick={(e) => handleRemoveIngredient(topping)}>
                X
              </button>

              <button type="submit">Submit</button>
            </>
          )}
        </div>
      );
    });
  }, [toppingsList, selectedTopping]);

  const handleFormChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;

    switch (name) {
      case "topping_name":
        setToppingInput(value);
        break;
      case "quantity":
        setToppingQuantity(parseInt(value));
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("IN HANDLE SUBMIT FORM", { e });
    let filtered = toppingsList.filter(
      (topping) => topping.name === toppingInput
    ).length;

    if (filtered < 1) {
      // IF not in list already;
      setToppingsList([
        ...toppingsList,
        { name: toppingInput, quantity: toppingQuantity },
      ]);
    } else {
      // TODO: build in confirmation/declanation of the message if not in editm
      alert(
        "Topping already exists, would you like to replace the quantity of this topping instead?"
      );

      let updatedQuantities = toppingsList.map((topping) => {
        if (topping.name === toppingInput) {
          // TODO: Resolve string to number conversion here
          topping.quantity = toppingQuantity;
        }

        return topping;
      });

      setToppingsList([...updatedQuantities]);
    }

    // CLOSES OUT EDIT MODE OF FIELD
    setSelectedTopping("");
  };

  const handleEditField = (topping) => {
    setToppingInput(topping.name);
    setToppingQuantity(topping.quantity);

    setSelectedTopping(topping.name);
  };

  const handleRemoveIngredient = (e: any) => {
    let name = e.name;

    let newList = toppingsList.filter((topping) => topping.name !== name);

    setToppingsList(newList);
  };

  return (
    <PageContain>
      <h2>This is the manager Page</h2>

      <ToppingsForm onSubmit={handleFormSubmit} onChange={handleFormChange}>
        <h3>Toppings Input Form</h3>

        <label htmlFor="topping_name">Topping Name</label>
        <input type="text" name="topping_name" />

        <label htmlFor="quantity">Quantity Avail</label>
        <input type="number" min={1} max={100} name="quantity" />

        <button type="submit">Submit</button>

        <div>Toppings list</div>
        {ToppingsItems}
      </ToppingsForm>
    </PageContain>
  );
};

const ToppingsForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid black;
  align-items: center;
  padding: 2rem;
`;

const PageContain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
`;

export default ManagerPage;
