import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './LoggedUserProvider';
import { getAllRoles } from '../api/RolesService'


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
    if (token) {
      const fetchRoles = async () => {
        const response = await getAllRoles(token);
        setRoles(response);
      };

      fetchRoles();
    } else {
      setRoles([]);
    }
  }, [token]);

  return (
    <RolesContext.Provider value={{ roles }}>
      {children}
    </RolesContext.Provider>
  );
};

