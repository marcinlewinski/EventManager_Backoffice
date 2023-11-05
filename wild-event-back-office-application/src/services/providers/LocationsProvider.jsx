import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './LoggedUserProvider';
import { getLocations } from '../api/LocationService'


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
      const response = await getLocations(token);
      setLocations(response);
    };

    fetchLocations();
  }, [token]);

  const addLocation = (newLocation) => {
    setLocations(prevLocations => [...prevLocations, newLocation]);
  };

  const removeLocation = (locationId) => {
    setLocations(prevLocations => prevLocations.filter(location => location.id !== locationId));
  };

  const updateLocation = (updatedLocationData) => {
    setLocations(prevLocation => prevLocation.map(location => {
      if (location.id === updatedLocationData.id) {
        return { ...location, ...updatedLocationData };
      }
      return location;
    }));
  };

  return (
    <LocationsContext.Provider value={{ locations, addLocation, removeLocation, updateLocation }}>
      {children}
    </LocationsContext.Provider>
  );
};

