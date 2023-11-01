import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './LoggedUserProvider';
import { getAllEvents } from '../api/EventService';


const EventsContext = createContext();

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error('useEvents must be used within a EventManagmentProvider');
    }
    return context;
};

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const { token } = useUser();


    useEffect(() => {
        if (token) {
            const fetchEvents = async () => {
                const response = await getAllEvents(token);
                setEvents(response);
            };

            fetchEvents();
        }
    }, [token]);

    return (
        <EventsContext.Provider value={{ events: events }}>
            {children}
        </EventsContext.Provider>
    );
};

