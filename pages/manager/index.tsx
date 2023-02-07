import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GET_TOPPINGS } from "@/helpers/queries/toppings";
import { ADD_TOPPING, REMOVE_TOPPING } from "@/helpers/mutations/toppings";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Role_data } from "../../contexts/role";
import { useRouter } from "next/router";
import LoadingDiv from "@/components/commons/LoadingDiv";
import { Topping } from "@/helpers/types";
import { IngrdientConsts } from "@/helpers/consts/ingredients";
import { RoleConsts } from "@/helpers/consts/roles";

/**
 *
 * @returns Manager page allowing manager role to update inventory
 */
const ManagerPage = () => {
  const [toppingsList, setToppingsList] = useState([]);
  const [toppingInput, setToppingInput] = useState("");
  const [toppingQuantity, setToppingQuantity] = useState<string | number>("");
  const [selectedTopping, setSelectedTopping] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { role } = useContext(Role_data);

  const router = useRouter();

  const [getToppings, { data, loading, error, refetch, fetchMore }] =
    useLazyQuery(GET_TOPPINGS);

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
    // TODO: Move to server side if possible from context to prevent refresh issue
    // Will probably require cookies instead of localStorage
    if (role && role === RoleConsts.Manager) {
      getToppings();
    } else {
      router.push("/");
    }
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
      if (!selectedTopping) {
        alert("Topping already exists, this will update the existing quantity");
      }

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

  const handleRemoveIngredient = (e, topping: Topping) => {
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

    let checkForCrusts = toppingsList.filter(
      (topping) =>
        topping.name.includes(IngrdientConsts.Dough) && topping.quantity < 1
    );

    !!checkForCrusts.length
      ? setErrorMessage("OUT OF CRUST DOUGH, ADD MORE TO MAKE MORE PIZZAS")
      : setErrorMessage("");

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
              {!topping.name.includes(IngrdientConsts.Dough) && (
                <button
                  onClick={(e) => {
                    handleRemoveIngredient(e, topping);
                  }}
                >
                  X
                </button>
              )}

              <button onClick={() => handleClearFields()}>Cancel Edit</button>

              <div>
                <label htmlFor="topping_name">Topping Name</label>
                <input
                  type="text"
                  name="topping_name"
                  defaultValue={topping.name}
                  disabled
                />
              </div>

              <div>
                <label htmlFor="quantity">Quantity Avail</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  name="quantity"
                  // Linked to standard form to maintain consistency
                  value={toppingQuantity}
                  // Prevents warning due to value for linking
                  onChange={() => {}}
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
  }, [toppingsList, selectedTopping, submitDisabled, toppingQuantity]);

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
            onChange={(e) => console.log({ toppingInput })}
            disabled={!!selectedTopping}
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
          {errorMessage ? (
            <span className="error-message">{errorMessage}</span>
          ) : (
            <span>
              Crust Dough is the only required ingredient, all others can be
              removed/added
            </span>
          )}
        </div>

        {loading && <LoadingDiv />}
        {!loading && ToppingsItems && (
          <ListContainer>{ToppingsItems}</ListContainer>
        )}
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
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
    text-align: center;
    gap: 1rem;

    .error-message {
      color: red;
      font-weight: bold;
    }
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
