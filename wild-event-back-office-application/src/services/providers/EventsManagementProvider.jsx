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
                try {
                    const response = await getAllEvents(token);
                    setEvents(response);
                } catch (error) {
                    setEvents([]);
                    console.error("Error fetching events: ", error);
                }
            };

            fetchEvents();
        }
    }, [token]);

    const addEvent = (newEvent) => {
        setEvents(prevEvents => [...prevEvents, newEvent]);
    };

    const deleteEvent = (eventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    };

    const updateEvent = (updatedEventData) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === updatedEventData.id) {
                return { ...event, ...updatedEventData };
            }
            return event;
        }));
    };

    return (
        <EventsContext.Provider value={{ events, addEvent, deleteEvent, updateEvent }}>
            {children}
        </EventsContext.Provider>
    );
};

