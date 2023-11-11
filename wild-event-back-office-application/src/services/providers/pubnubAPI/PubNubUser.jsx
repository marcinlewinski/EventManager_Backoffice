import React, { createContext, useState } from 'react';
import pubnub from 'pubnub';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [allUsersData, setAllUsersData] = useState([]);

    const setUserMetadata = async (metadata) => {
        try {
            const response = await pubnub.objects.setUUIDMetadata({
                data: {
                    name: metadata.name,
                    email: metadata.email,
                    custom: metadata.custom
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error setting user metadata:', error);
        }
    };

    const getUserMetadata = async () => {
        try {
            const response = await pubnub.objects.getUUIDMetadata();
            setUserData(response.data);
        } catch (error) {
            console.error('Error getting user metadata:', error);
        }
    };

    const getAllUsersMetadata = async () => {
        try {
            const response = await pubnub.objects.getAllUUIDMetadata();
            setAllUsersData(response.data);
        } catch (error) {
            console.error('Error getting all users metadata:', error);
        }
    };

    const removeUserMetadata = async () => {
        try {
            await pubnub.objects.removeUUIDMetadata();
            setUserData({});
        } catch (error) {
            console.error('Error removing user metadata:', error);
        }
    };

    return (
        <UserContext.Provider value={{ userData, allUsersData, setUserMetadata, getUserMetadata, getAllUsersMetadata, removeUserMetadata }}>
            {children}
        </UserContext.Provider>
    );
};
