import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './useUser';
import { getLocations } from './LocationService'


const LocationsContext = createContext();

export const useLocations = () => {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error('useLocations must be used within a LocationsProvider');
  }
  return context;
};

export const LocationsProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const { token } = useUser();

  useEffect(() => {
    const fetchLocations = async () => {
      const response  = await getLocations(token);
        setLocations(response);
    };

    fetchLocations();
  }, [token]);

  return (
    <LocationsContext.Provider value={{ locations }}>
      {children}
    </LocationsContext.Provider>
  );
};

