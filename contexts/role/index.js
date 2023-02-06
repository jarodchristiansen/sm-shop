import { createContext, useEffect, useState } from "react";

export const Role_data = createContext(null);

function RoleContext({ children }) {
  const [role, setRole] = useState();

  useEffect(() => {
    getRoleFromStorage();
  }, []);

  const getRoleFromStorage = () => {
    if (!role) {
      let existingRole = localStorage.getItem("user-role");

      if (existingRole) {
        setRole(existingRole);
      }
    }
  };

  useEffect(() => {
    swapRole();
  }, [role]);

  const swapRole = () => {
    if (role) {
      let existingRole = localStorage.getItem("user-role");

      if (existingRole && existingRole !== role) {
        localStorage.setItem("user-role", role);
      } else if (!existingRole) {
        localStorage.setItem("user-role", role);
      }
    }
  };

  return (
    <Role_data.Provider value={{ role, setRole }}>
      {children}
    </Role_data.Provider>
  );
}

export default RoleContext;
