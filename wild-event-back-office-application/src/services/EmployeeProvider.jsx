import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './useUser';
import { getAllActiveUsers } from './EmployeeManagement';


const EmployeesContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within a EmployeesProvider');
  }
  return context;
};

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const { token } = useUser();

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getAllActiveUsers(token);
      setEmployees(response);
    };

    fetchEmployees();
  }, [token]);

  return (
    <EmployeesContext.Provider value={{ employees }}>
      {children}
    </EmployeesContext.Provider>
  );
};

