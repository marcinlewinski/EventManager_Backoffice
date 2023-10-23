import React, { createContext, useEffect, useState } from 'react';
import { getAllRoles } from "./Roles";
import { useUser } from "./useUser"

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [userRoles, setUserRoles] = useState([]);
  const { token } = useUser();

  useEffect(() => {
    async function fetchRoles() {
      const roles = await getAllRoles(token);
      setUserRoles(roles);
    }
    fetchRoles();
  }, []);

  return (
    <RoleContext.Provider value={{ userRoles }}>
      {children}
    </RoleContext.Provider>
  );
}

export default RoleContext;
