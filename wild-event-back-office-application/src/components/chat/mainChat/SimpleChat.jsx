import React, { useState, useEffect, useCallback } from "react";
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
import "./styles/simple-chat.scss";
import { ReactComponent as PeopleGroup } from "../../../assets/people-group.svg";
import { Button } from "@mui/material";
import { getAllUsersData } from "../service/pubNubService";
import { useUser } from "../../../services/providers/LoggedUserProvider";
import CreateChatModal from "../modal/CreateChatModal";
import { Typography } from "@mui/material";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDarkMode } from "../../darkMode/DarkModeProvider";
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteChannelDialog from "../modal/DeleteChannelDialog";

function SimpleChat() {
  const pubnub = usePubNub();
  const [directChannelList, setDirectChannelList] = useState([]);
  const [socialChannelList, setSocialChannelList] = useState([]);
  const allChannelIds = [...directChannelList, ...socialChannelList].map((channel) => channel.id);
  const [users, setUsers] = useState();
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [presenceData] = usePresence({ channels: allChannelIds });
  const [currentChannel, setCurrentChannel] = useState({});
  const [modalOpen, setModalOpen] = useState({
    createChatModal: false,
    confirmDialog: false,
  });
  const { user } = useUser();
  const { darkMode } = useDarkMode();
  const theme = darkMode ? "dark" : "light";

  useEffect(() => {
    getAllUsersData(pubnub).then(allUsers => {
      setUsers(allUsers);
    });
  }, []);

  const currentUser = users?.find((u) => u.id === user.id);

  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map(
    (o) => o.uuid
  );
  const presentUsers = presentUUIDs?.length ? users.filter((u) => presentUUIDs.includes(u.id)) : [];

  const fetchChannels = useCallback(async () => {
    try {
      const response = await pubnub.objects.getMemberships({ uuid: user.id });
      const channels = response.data.map((channel) => channel.channel);
      console.log(channels)
      const directChannels = channels.filter(channel => channel.id.startsWith("direct."));
      const socialChannels = channels.filter(channel => channel.id.startsWith("group."));

      setDirectChannelList(directChannels);
      setSocialChannelList(socialChannels);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }, [pubnub, user.id]);

  const deleteChannel = async () => {
    try {
      await pubnub.objects.removeMemberships({
        channels: [currentChannel.id]
      });

      await pubnub.objects.removeChannelMetadata({ channel: currentChannel.id });

      fetchChannels();
      setCurrentChannel({});

    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  useEffect(() => {
    if (currentChannel && currentChannel.id) {
      pubnub.subscribe({ channels: [currentChannel.id] });
    }

    return () => {
      if (currentChannel && currentChannel.id) {
        pubnub.unsubscribe({ channels: [currentChannel.id] });
      }
    };
  }, [currentChannel, pubnub]);

  useEffect(() => {
    fetchChannels();
  }, []);




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
          <Button variant="contained" color="primary" onClick={() => setModalOpen({...modalOpen, createChatModal: true })}>
            Create Chat
          </Button>
          {modalOpen.createChatModal && (
            <CreateChatModal
              users={users}
              currentUser={currentUser}
              setCurrentChannel={setCurrentChannel}
              hideModal={() => setModalOpen({...modalOpen, createChatModal: false })}
              onChannelCreated={fetchChannels}
            />
          )}
          <h4>Channels</h4>
          <div>
            <ChannelList
              channels={socialChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
            />
          </div>
          <h4>Direct Chats</h4>
          <div>
            <ChannelList
              channels={directChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
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
              <IconButton
                aria-label="delete"
                onClick={() => setModalOpen({...modalOpen, confirmDialog: true })}
              >
                <DeleteIcon />
              </IconButton>
              <div>
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
                reactionsPicker={<Picker data={emojiData} />}
              >
                <TypingIndicator showAsMessage />
              </MessageList>
              <hr />
              <MessageInput
                senderInfo={true}
                typingIndicator
                emojiPicker={<Picker data={emojiData} />}
                fileUpload="all"
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
        <DeleteChannelDialog
          open={modalOpen.confirmDialog}
          onClose={() => setModalOpen({ ...modalOpen, confirmDialog: false })}
          onConfirm={deleteChannel}
        />
      </Chat>
    </div>
  );
}

export default SimpleChat;