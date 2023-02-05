import { createContext, useEffect, useState } from "react";

export const Message_data = createContext(null);

function RoleContext({ children }) {
  const [message, setMessage] = useState();

  useEffect(() => {
    getRoleFromStorage();
  }, []);

  const getRoleFromStorage = () => {
    if (!message) {
      let existingRole = localStorage.getItem("user-role");

      if (existingRole) {
        setMessage(existingRole);
      }
    }
  };

  useEffect(() => {
    swapRole();
  }, [message]);

  const swapRole = () => {
    if (message) {
      let existingRole = localStorage.getItem("user-role");

      if (existingRole && existingRole !== message) {
        localStorage.setItem("user-role", message);
      } else if (!existingRole) {
        localStorage.setItem("user-role", message);
      }
    }
  };

  return (
    <Message_data.Provider value={{ message, setMessage }}>
      {children}
    </Message_data.Provider>
  );
}

export default RoleContext;
