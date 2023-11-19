export const getAllUsersData = async (pubnub) => {
    try {
        const response = await pubnub.objects.getAllUUIDMetadata();
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error getting users metadata:', error);
    }
};

export const getCurrentUserData = (pubnub) => {
    try {
        const user = pubnub.objects.getUUIDMetadata();
        console.log(user.data)
        return user.data;
    } catch (error) {
        console.error('Error getting current user UUID:', error);
    }
};

export const getUserData = async (pubnub, uuid) => {
    try {
        const response = await pubnub.objects.getAllUUIDMetadata(uuid);
        return response.data;
    } catch (error) {
        console.error('Error getting users metadata:', error);
    }
};

export const deactivateUserFromPubNub = async (pubnub, uuid) => {
    try {
        await pubnub.objects.removeUUIDMetadata({ uuid: uuid });
    } catch (error) {
        console.error('Error removing user from PubNub:', error);
        return;
    }
};