import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './useUser';
import { getAllActiveUsers, deactivateUser, registerUser, updateUser } from './EmployeeManagement';
import { useLocations } from './LocationsProvider';
import { useRoles } from './RolesProvider';


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
  const { roles } = useRoles();
  const { locations } = useLocations();

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getAllActiveUsers(token);
      setEmployees(response);
      console.log(response)
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

  const updateEmployee = async (employeeId, updatedData) => {
    try {
      console.log("Before updateUser:", updatedData);
    const updatedEmployee = await updateUser(employeeId, updatedData, token);
    
      updatedEmployee.roles = updatedData.roleIds.map(roleId => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.title : '';
      });
  
      updatedEmployee.locations = updatedData.locationIds.map(locationId => {
        const location = locations.find(l => l.id === locationId);
        return location ? location.title : '';
      });
  
      console.log("After updateUser:", updatedEmployee);
      setEmployees(prevEmployees =>
        prevEmployees.map(employee =>
          employee.id === employeeId ? updatedEmployee : employee
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
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
    <EmployeesContext.Provider value={{ employees, deactivateEmployee, addEmployee, updateEmployee }}>
      {children}
    </EmployeesContext.Provider>
  );
};

