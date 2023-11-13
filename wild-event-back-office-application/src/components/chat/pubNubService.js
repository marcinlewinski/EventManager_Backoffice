export const getAllUsersData = async (pubnub) => {
    try {
        const response = await pubnub.objects.getAllUUIDMetadata();

        return response.data;
    } catch (error) {
        console.error('Error getting users metadata:', error);
    }
};