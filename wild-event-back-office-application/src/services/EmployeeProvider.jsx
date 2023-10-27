import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './useUser';
import { getAllActiveUsers, deactivateUser } from './EmployeeManagement';


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

  const addEmployee = async (newEmployeeData) => {
    try {
      await registerUser(newEmployeeData);
      setEmployees(prevEmployees => [...prevEmployees, newEmployeeData]);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  

  const deactivateEmployee = async (employeeId) => {
    try {
      await deactivateUser(employeeId, token);
      const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Could not deactivate user:", error);
    }
  };
  

  return (
    <EmployeesContext.Provider value={{ employees, deactivateEmployee, addEmployee }}>
      {children}
    </EmployeesContext.Provider>
  );
};

