// export const getAllUsersData = async (pubnub) => {
//     try {
//         const response = await pubnub.objects.getAllUUIDMetadata({include: {customFields: true}});
//         return response.data;
//     } catch (error) {
//         console.error('Error getting users metadata:', error);
//     }
// };

// export const getCurrentUserData = (pubnub) => {
//     try {
//         const user = pubnub.objects.getUUIDMetadata();
//         return user.data;
//     } catch (error) {
//         console.error('Error getting current user UUID:', error);
//     }
// };

// export const getUserData = async (pubnub, uuid) => {
//     try {
//         const response = await pubnub.objects.getAllUUIDMetadata(uuid);
//         return response.data;
//     } catch (error) {
//         console.error('Error getting users metadata:', error);
//     }
// };

export const deactivateUserFromPubNub = async (pubnub, uuid) => {
    try {
        await pubnub.objects.removeUUIDMetadata({ uuid: String(uuid) });
    } catch (error) {
        console.error('Error removing user from PubNub:', error);
        return;
    }
};

export const getChannelsTimetokens = async (pubnub) => {
    try {
      const response = await pubnub.objects.getMemberships({ include: { customFields: true } });
      const timetokens = response.data.map((channel) => channel.custom.lastReadTimetoken);
      return timetokens;
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  export const getChannelsIds = async (pubnub) => {
    try {
      const response = await pubnub.objects.getMemberships({ include: { customFields: true } });
      const channelsIds = response.data.map((channel) => channel.channel.id);
      return channelsIds;
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  export const setTimetoken = (pubnub, channelId) => {
    let timestamp = new Date().getTime() * 10000;
    
    pubnub.objects.setMemberships({
      channels: [{
        id: channelId,
        custom: {
          lastReadTimetoken: timestamp.toString()
        }
      }]
    });
  }