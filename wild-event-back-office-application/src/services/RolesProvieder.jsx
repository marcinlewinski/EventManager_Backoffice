import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './useUser';
import { getAllRoles } from './Roles'


const RolesContext = createContext();

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const { token } = useUser();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response  = await getAllRoles(token);
        setRoles(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoles();
  }, [token]);

  return (
    <RolesContext.Provider value={{ roles }}>
      {children}
    </RolesContext.Provider>
  );
};

