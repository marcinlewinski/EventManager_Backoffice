import React, { useState, useEffect } from "react";
import DarkModeToggle from "react-dark-mode-toggle";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  TypingIndicator,
  usePresence
} from "@pubnub/react-chat-components";
import EmojiPicker from 'emoji-picker-react';
import "./simple-chat.scss";
import { ReactComponent as PeopleGroup } from "./people-group.svg";
import { Button } from "@mui/material";
import { getAllUsersData } from "./pubNubService";
import { useUser } from "../../services/providers/LoggedUserProvider";
import CreateChatModal from "./CreateChatModal";
import { Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function SimpleChat() {
  const pubnub = usePubNub();
  const [directChannelList, setDirectChannelList] = useState([]);
  const [socialChannelList, setSocialChannelList] = useState([]);
  const allChannelIds = [...directChannelList, ...socialChannelList].map((channel) => channel.id);
  const [users, setUsers] = useState();
  const [theme, setTheme] = useState("light");
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [welcomeMessages, setWelcomeMessages] = useState({});
  const [presenceData] = usePresence({ channels: allChannelIds });
  const [currentChannel, setCurrentChannel] = useState({});
  const [createChatModalOpen, setCreateChatModalOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    getAllUsersData(pubnub).then(allUsers => {
      setUsers(allUsers);
    });
  }, [pubnub, getAllUsersData]);
  const currentUser = users?.find((u) => u.id === user.id);

  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map(
    (o) => o.uuid
  );
  const presentUsers = presentUUIDs?.length ? users.filter((u) => presentUUIDs.includes(u.id)) : [];

  console.log(users)
  
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await pubnub.objects.getAllChannelMetadata();
        const channels = response.data;
        
        const directChannels = channels.filter(channel => channel.id.startsWith("direct."));
        const socialChannels = channels.filter(channel => channel.id.startsWith("group."));
        
  
        setDirectChannelList(directChannels);
        setSocialChannelList(socialChannels);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
  
    fetchChannels();
  }, [pubnub]);

  useEffect(() => {
    // Subscribe to the current channel
    if (currentChannel && currentChannel.id) {
      pubnub.subscribe({ channels: [currentChannel.id] });
      console.log(`Subscribed to channel: ${currentChannel.id}`);
    }

    // Unsubscribe when the component unmounts or when the channel changes
    return () => {
      if (currentChannel && currentChannel.id) {
        pubnub.unsubscribe({ channels: [currentChannel.id] });
        console.log(`Unsubscribed from channel: ${currentChannel.id}`);
      }
    };
  }, [currentChannel, pubnub]);
  
  const deleteChat = async (channelId) => {
    try {
      // Delete the channel metadata
      await pubnub.objects.removeChannelMetadata({ channel: channelId });
  
      // Unsubscribe from the channel
      pubnub.unsubscribe({ channels: [channelId] });
  
      // Update the UI by filtering out the deleted channel
      setDirectChannelList(directChannelList.filter(channel => channel.id !== channelId));
      setSocialChannelList(socialChannelList.filter(channel => channel.id !== channelId));
  
      // Reset current channel if it's the one being deleted
      if (currentChannel.id === channelId) {
        setCurrentChannel({});
      }
  
      console.log(`Chat ${channelId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };
  

  return (
    <div className={`app-simple ${theme}`}>
      <Chat
        theme={theme}
        users={users}
        currentChannel={currentChannel.id}
        channels={allChannelIds}
      >
        <div className={`channels ${showChannels && "shown"}`}>
          <div className="user">
            {currentUser?.profileUrl && (
              <img src={currentUser?.profileUrl} alt="User avatar" />
            )}
            <h4>
              {currentUser?.name}{" "}
              <span className="close" onClick={() => setShowChannels(false)}>
                ✕
              </span>
            </h4>
          </div>
          <Button variant="outlined" color="primary" onClick={() => setCreateChatModalOpen(true)}>
            Create Chat
          </Button>
          {createChatModalOpen && (
            <CreateChatModal 
              users={users} 
              currentUser={currentUser} 
              setCurrentChannel={setCurrentChannel} 
              hideModal={() => setCreateChatModalOpen(false)} 
            />
          )}
          <h4>Channels</h4>
          <div>
            <ChannelList
              channels={socialChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
              onDeleteChannel={(channel) => deleteChat(channel.id)}
              renderItem={(channel) => (
                <div className="channel-item">
                  <span>{channel.name}</span>
                  <IconButton 
                    size="small" 
                    onClick={() => deleteChat(channel.id)}
                    aria-label="delete"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              )}
            />
          </div>
          <h4>Direct Chats</h4>
          <div>
            <ChannelList
              channels={directChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
            />
          </div>
          <div className="toggle">
            <span>Dark Mode</span>
            <DarkModeToggle
              size={50}
              checked={theme === "dark"}
              onChange={(isDark) =>
                isDark ? setTheme("dark") : setTheme("light")
              }
            />
          </div>
        </div>

        <div className="chat">
          {currentChannel.id ? (
            <>
              <div
                className={`people ${showMembers ? "active" : ""}`}
                onClick={() => setShowMembers(!showMembers)}
              >
                <span>{presenceData[currentChannel.id]?.occupancy || 0}</span>
                <PeopleGroup />
              </div>

              <div className="info">
                <span className="hamburger" onClick={() => setShowChannels(true)}>
                  ☰
                </span>
                <h4>{currentChannel.name}</h4>
                <small>{currentChannel.description}</small>
                <hr />
              </div>

              <MessageList
                fetchMessages={100}
                enableReactions
                emojiPicker={<EmojiPicker onEmojiClick={(event, emojiObject) => {}} />}
              >
                <TypingIndicator showAsMessage />
              </MessageList>
              <hr />
              <MessageInput
                senderInfo={true}
                typingIndicator
                fileUpload="all"
                emojiPicker={<EmojiPicker onEmojiClick={(event, emojiObject) => {}} />}
              />
            </>
          ) : (
            <Typography 
              variant="subtitle1" 
              color="textSecondary" 
              align="center" 
              style={{ marginTop: '20px' }}
            >
              Select existing chat or create new one to start conversation.
            </Typography>
          )}
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <h4>
            Online Users
            <span className="close" onClick={() => setShowMembers(false)}>
              ✕
            </span>
          </h4>
          <MemberList members={presentUsers} />
        </div>
      </Chat>
    </div>
  );
}

export default SimpleChat;