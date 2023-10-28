import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './useUser';
import {getMap} from "./MapService"

const MapContext = createContext();

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within a RolesProvider');
    }
    return context;
};

export const MapProvider = ({ children }) => {
    const [map, setMap] = useState({});
    const { token } = useUser();

    useEffect(() => {
        const fetchMap = async () => {
            const response = await getMap(token);
            setMap(response);
        };

        fetchMap();
    }, [token]);

    return (
        <MapContext.Provider value={{ map: map }}>
            {children}
        </MapContext.Provider>
    );
};

