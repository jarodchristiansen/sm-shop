import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { ADD_TOPPING } from "@/helpers/mutations/toppings";
import { useLazyQuery, useMutation } from "@apollo/client";

import { Message_data } from "../../contexts/role";

const ManagerPage = () => {
  const [toppingsList, setToppingsList] = useState([]);
  const [toppingInput, setToppingInput] = useState("");
  const [toppingQuantity, setToppingQuantity] = useState(0);
  const [selectedTopping, setSelectedTopping] = useState("");

  const { message, setMessage } = useContext(Message_data);

  console.log({ message }, "IN MANAGER PAGE");

  const [getToppings, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery(GET_TOPPINGS, {
      fetchPolicy: "cache-and-network",
    });

  const [
    addTopping,
    { loading: toppingUpdateLoading, error: addToppingError },
  ] = useMutation(ADD_TOPPING, {
    refetchQueries: [{ query: GET_TOPPINGS }],
  });

  const [
    removeTopping,
    { loading: removeToppingLoading, error: removeToppingError },
  ] = useMutation(ADD_TOPPING, {
    refetchQueries: [{ query: GET_TOPPINGS }],
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
              <button onClick={(e) => handleRemoveIngredient(topping)}>
                X
              </button>
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

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("IN HANDLE SUBMIT FORM", { e });
    let filtered = toppingsList.filter(
      (topping) => topping.name === toppingInput
    ).length;

    if (filtered < 1) {
      await addTopping({
        variables: { name: toppingInput, quantity: toppingQuantity },
      });
    } else {
      // TODO: build in confirmation/declanation of the message if not in editm
      alert(
        "Topping already exists, would you like to replace the quantity of this topping instead?"
      );

      //   let updatedQuantities = toppingsList.map((topping) => {
      //     if (topping.name === toppingInput) {
      //       // TODO: Resolve string to number conversion here
      //       console.log({ topping });
      //       topping.quantity = toppingQuantity;
      //     }

      //     return topping;
      //   });

      let filteredTopping = toppingsList.filter(
        (topping) => topping.name === toppingInput
      );
      let result = { ...filteredTopping[0] };

      result.quantity = toppingQuantity;

      await addTopping({
        variables: result,
      });

      //   setToppingsList([...updatedQuantities]);
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

        <ListContainer>{ToppingsItems}</ListContainer>
      </ToppingsForm>
    </PageContain>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 30rem;

  div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    border: 1px solid black;
  }
`;

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
