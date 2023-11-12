import React, { createContext, useState, useContext } from 'react';
import pubnub from 'pubnub';

export const PubNubDataContext = createContext();

export const usePubNubData = () => {
    const context = useContext(PubNubDataContext);
    if (!context) {
        throw new Error('usePubNubData must be used within a PubNubDataProvider');
    }
    return context;
};


export const PubNubDataProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [allUsersData, setAllUsersData] = useState([]);
    const [channelMetadataState, setChannelMetadataState] = useState([]);
    const [socialChannelList, setSocialChannelList] = useState([]);
    const [directChannelList, setDirectChannelList] = useState([]);

    const setUserMetadata = async (metadata) => {
        try {
            const response = await pubnub.objects.setUUIDMetadata({
                data: {
                    name: metadata.name,
                    email: metadata.email,
                    custom: metadata.custom
                }
            });
            setAllUsersData(prevUsers => [...prevUsers, response.data]);
        } catch (error) {
            console.error('Error setting user metadata:', error);
        }
    };

    const getUserMetadata = async () => {
        try {
            const response = await pubnub.objects.getUUIDMetadata();
            setCurrentUser(response.data);
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
            setCurrentUser({});
        } catch (error) {
            console.error('Error removing user metadata:', error);
        }
    };
    const setChannelMetadata = async (channel, metadata) => {
        try {
            const response = await pubnub.objects.setChannelMetadata({
                channel,
                data: metadata
            });
            setChannelMetadataState({ ...channelMetadataState, [channel]: response.data });
        } catch (error) {
            console.error('Error setting channel metadata:', error);
        }
    };

    const getChannelMetadata = async (channel) => {
        try {
            const response = await pubnub.objects.getChannelMetadata({ channel });
            setChannelMetadataState({ ...channelMetadataState, [channel]: response.data });
        } catch (error) {
            console.error('Error getting channel metadata:', error);
        }
    };

    const getAllChannelMetadata = async () => {
        try {
            const response = await pubnub.objects.getAllChannelMetadata();
            setChannelMetadataState(response.data);

            const social = response.data.filter(channel => channel.custom?.type === 'social');
            const direct = response.data.filter(channel => channel.custom?.type === 'direct');
            setSocialChannelList(social);
            setDirectChannelList(direct);
        } catch (error) {
            console.error('Error getting all channel metadata:', error);
        }
    };

    const removeChannelMetadata = async (channel) => {
        try {
            await pubnub.objects.removeChannelMetadata({ channel });
            const updatedMetadata = { ...channelMetadataState };
            delete updatedMetadata[channel];
            setChannelMetadataState(updatedMetadata);
        } catch (error) {
            console.error('Error removing channel metadata:', error);
        }
    };

    return (
        <PubNubDataContext.Provider value={{
            currentUser, allUsersData, setUserMetadata, getUserMetadata, getAllUsersMetadata, removeUserMetadata,
            channelMetadataState, setChannelMetadataState, getChannelMetadata, getAllChannelMetadata, removeChannelMetadata,
            directChannelList, socialChannelList
        }}>
            {children}
        </PubNubDataContext.Provider>
    );
};
