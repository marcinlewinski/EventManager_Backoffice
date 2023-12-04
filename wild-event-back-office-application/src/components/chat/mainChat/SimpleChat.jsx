import React, { useState, useEffect, useCallback } from "react";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  TypingIndicator,
  usePresence,
  useUsers
} from "@pubnub/react-chat-components";
import "./styles/simple-chat.scss";
import { ReactComponent as PeopleGroup } from "../../../assets/people-group.svg";
import { Button } from "@mui/material";
import { useUser } from "../../../services/providers/LoggedUserProvider";
import CreateChatModal from "../modal/CreateChatModal";
import { Typography } from "@mui/material";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDarkMode } from "../../darkMode/DarkModeProvider";
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteChannelDialog from "../modal/DeleteChannelDialog";
import { getChannelsTimetokens, getChannelsIds, setTimetoken } from "../service/pubNubService";

function SimpleChat() {
  const pubnub = usePubNub();
  const [directChannelList, setDirectChannelList] = useState([]);
  const [socialChannelList, setSocialChannelList] = useState([]);
  const allChannelIds = [...directChannelList, ...socialChannelList].map((channel) => channel.id);
  const [users] = useUsers();
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
  const [unreadedMessages, setUnreadedMessages] = useState({});
  const theme = darkMode ? "dark" : "light";
  const currentUser = users?.find((u) => u.id === user.id);
  const presentUUIDs = presenceData[currentChannel.id]?.occupants?.map(
    (o) => o.uuid
  );
  const presentUsers = presentUUIDs?.length ? users.filter((u) => presentUUIDs.includes(u.id)) : [];

  const getUnreadedMessages = async () => {
    const timetokens = await getChannelsTimetokens(pubnub);
    const channelsIds = await getChannelsIds(pubnub);
    try {
      const unreads = await pubnub.messageCounts({
        channels: [channelsIds],
        channelTimetokens: [timetokens],
      })
      setUnreadedMessages(unreads.channels);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchChannels = useCallback(async () => {
    try {
      const response = await pubnub.objects.getMemberships({ include: { customFields: true } });
      const channels = response.data.map((channel) => channel.channel);

      const directChannels = channels.filter(channel => channel.id.startsWith("direct."));
      const socialChannels = channels.filter(channel => channel.id.startsWith("group."));
      setDirectChannelList(directChannels);
      setSocialChannelList(socialChannels);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }, []);

  const deleteChannel = async () => {
    try {
      await pubnub.objects.removeMemberships({
        channels: [currentChannel.id]
      });

      await pubnub.objects.removeChannelMetadata({
        channel: currentChannel.id
      });

      fetchChannels();
      setCurrentChannel({});
      setModalOpen({ ...modalOpen, confirmDialog: false });
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  useEffect(() => {
    try {
      pubnub.subscribe({ channels: allChannelIds });
    }
    catch (error) {
      console.error("error")
    }

    return () => {
      try {
        pubnub.unsubscribe({ channels: allChannelIds });
      }
      catch (error) {
        console.error("error")
      }
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, []);


  pubnub.addListener({
    message: function () {
      getUnreadedMessages();
    }
  });

  const renderChannel = (channel) => {
    const unreadCount = unreadedMessages[channel.id] || 0;
    const titleClass = unreadCount > 0 ? "channel-with-unread_name" : "pn-channel__name";

    return (
      <div key={channel.id} className="pn-channel" onClick={() => {
        setCurrentChannel(channel);
        setTimetoken(pubnub, channel.id);
        getUnreadedMessages();
      }}>
        <div className="pn-channel__title">
          <p className={titleClass}>{channel.name} {unreadCount > 0 && "(new messages)"}</p>
          {channel.description && <p className="pn-channel__description">{channel.description}</p>}
        </div>
        <div className="pn-channel__actions">
          <IconButton
            aria-label="delete"
            onClick={() => setModalOpen({ ...modalOpen, confirmDialog: true })}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    );
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
          <Button variant="contained" color="primary" onClick={() => setModalOpen({ ...modalOpen, createChatModal: true })}>
            Create Chat
          </Button>
          {modalOpen.createChatModal && (
            <CreateChatModal
              users={users}
              currentUser={currentUser}
              setCurrentChannel={setCurrentChannel}
              hideModal={() => setModalOpen({ ...modalOpen, createChatModal: false })}
              onChannelCreated={fetchChannels}
            />
          )}
          <h4>Channels</h4>
          <div>
            <ChannelList
              channels={socialChannelList}
              channelRenderer={(channel) => renderChannel(channel)}
            />
          </div>
          <h4>Direct Chats</h4>
          <div>
            <ChannelList
              channels={directChannelList}
              channelRenderer={(channel) => renderChannel(channel)}
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