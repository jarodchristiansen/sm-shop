import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { ADD_TOPPING, REMOVE_TOPPING } from "@/helpers/mutations/toppings";
import { useLazyQuery, useMutation } from "@apollo/client";

import { Role_data } from "../../contexts/role";
import { useRouter } from "next/router";

const ManagerPage = () => {
  const [toppingsList, setToppingsList] = useState([]);
  const [toppingInput, setToppingInput] = useState("");
  const [toppingQuantity, setToppingQuantity] = useState<string | number>("");
  const [selectedTopping, setSelectedTopping] = useState("");

  const { role, setRole } = useContext(Role_data);

  const router = useRouter();

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
  ] = useMutation(REMOVE_TOPPING, {
    refetchQueries: [{ query: GET_TOPPINGS }],
  });

  useEffect(() => {
    getToppings();

    // // TODO: Move to server side if possible from context
    // // Will probably require cookies instead of localStorage
    // if (message && message === "Manager") {
    //   getToppings();
    // } else {
    //   router.push("/");
    // }
  }, []);

  useEffect(() => {
    if (data?.getCurrentToppings) {
      setToppingsList(data.getCurrentToppings);
    }
  }, [data]);

  const handleFormChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;

    switch (name) {
      case "topping_name":
        setToppingInput(value);
        break;
      case "quantity":
        if (value) {
          setToppingQuantity(parseInt(value));
        } else {
          setToppingQuantity("");
        }

        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      let filteredTopping = toppingsList.filter(
        (topping) => topping.name === toppingInput
      );
      let result = { ...filteredTopping[0] };

      result.quantity = toppingQuantity;

      await addTopping({
        variables: result,
      });
    }

    handleClearFields();
  };

  const handleEditField = (topping) => {
    setToppingInput(topping.name);
    setToppingQuantity(topping.quantity);

    setSelectedTopping(topping.name);
  };

  const handleRemoveIngredient = (e, topping: any) => {
    e.preventDefault();
    let name = topping.name;

    removeTopping({ variables: { name } });
    handleClearFields();
  };

  const handleClearFields = () => {
    setToppingInput("");
    setToppingQuantity("");
    setSelectedTopping("");
  };

  const submitDisabled = useMemo(() => {
    if (!toppingInput || !toppingQuantity) {
      return true;
    } else if (toppingInput && toppingQuantity) {
      return false;
    }
  }, [toppingInput, toppingQuantity, selectedTopping]);

  const ToppingsItems = useMemo(() => {
    if (!toppingsList.length) return [];

    return toppingsList.map((topping) => {
      return (
        <div key={topping.name}>
          {topping.name !== selectedTopping ? (
            <div className="standard-row">
              <span>Topping: {topping.name}</span>
              <span>Quantity: {topping.quantity}</span>
              <button onClick={(e) => handleEditField(topping)}>Edit</button>
            </div>
          ) : (
            <div className="selected-topping-row">
              <button
                onClick={(e) => {
                  handleRemoveIngredient(e, topping);
                }}
              >
                X
              </button>

              <button onClick={() => handleClearFields()}>Cancel Edit</button>

              <div>
                <label htmlFor="topping_name">Topping Name</label>
                <input
                  type="text"
                  name="topping_name"
                  defaultValue={topping.name}
                />
              </div>

              <div>
                <label htmlFor="quantity">Quantity Avail</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  name="quantity"
                  defaultValue={topping.quantity}
                />
              </div>

              <button type="submit" disabled={submitDisabled}>
                Submit
              </button>
            </div>
          )}
        </div>
      );
    });
  }, [toppingsList, selectedTopping, submitDisabled]);

  return (
    <PageContain>
      <h1>Manager Portal</h1>

      <ToppingsForm onSubmit={handleFormSubmit} onChange={handleFormChange}>
        <div className="input-container">
          <label htmlFor="topping_name">Topping Name</label>
          <input
            type="text"
            name="topping_name"
            value={toppingInput}
            onChange={() => console.log({ toppingInput })}
          />

          <label htmlFor="quantity">Quantity Avail</label>
          <input
            type="number"
            min={1}
            max={100}
            name="quantity"
            value={toppingQuantity}
            onChange={() => console.log({ toppingQuantity })}
          />
        </div>

        <div>
          <button type="submit" disabled={submitDisabled}>
            Submit
          </button>
        </div>

        <div className="list-header">
          <h4>Toppings List</h4>
          <span>Add, Edit, or Remove Toppings</span>
        </div>

        <ListContainer>{ToppingsItems}</ListContainer>
      </ToppingsForm>
    </PageContain>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 40rem;
  gap: 0.5rem;

  .standard-row {
    display: grid;
    grid-template-columns: 2fr 1fr 0.5fr;
    width: 100%;
    justify-content: space-between;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 0.5rem 1rem;
  }

  .selected-topping-row {
    display: flex;
    flex-direction: row;
    border: 1px solid gray;
    border-radius: 5px;
  }
`;

const ToppingsForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid black;
  align-items: center;
  padding: 2rem 0;
  gap: 1rem;
  max-width: 60rem;

  .input-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;

    input {
      border: 1px solid gray;
      border-radius: 5px;
      padding: 0.5rem 1rem;
    }
  }

  .list-header {
    padding: 2rem 0;
    text-align: center;
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

    :disabled {
      cursor: not-allowed;
    }
  }
`;

export default ManagerPage;
