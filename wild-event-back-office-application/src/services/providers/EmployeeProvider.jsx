import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './LoggedUserProvider';
import { getAllActiveUsers, deactivateUser, registerUser, updateUser } from '../api/EmployeeManagement';

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
    if (token) {
      const fetchEmployees = async () => {
        const response = await getAllActiveUsers(token);
        setEmployees(response);
      };

      fetchEmployees();
    }
  }, [token]);

  const addEmployee = async (newEmployeeData) => {
    try {
      const newEmployee = await registerUser(newEmployeeData);
      setEmployees(prevEmployees => [...prevEmployees, newEmployee]);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const updateEmployee = async (employeeId, updatedData) => {
    try {
      const updatedEmployee = await updateUser(employeeId, updatedData, token);

      setEmployees(prevEmployees =>
        prevEmployees.map(employee =>
          employee.id === employeeId ? updatedEmployee : employee
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deactivateEmployee = (employeeId) => {
    try {
      const updatedEmployees = employees.filter(employee => employee.id !== employeeId);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error("Could not deactivate user:", error);
    }
  };

  return (
    <EmployeesContext.Provider value={{ employees, deactivateEmployee, addEmployee, updateEmployee }}>
      {children}
    </EmployeesContext.Provider>
  );
};

