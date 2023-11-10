import React, { useState, useEffect, useCallback } from 'react';
import { Picker } from 'emoji-mart';
import { usePubNub } from 'pubnub-react';
import {
  ChannelList,
  Chat,
  MemberList,
  MessageInput,
  MessageList,
  TypingIndicator,
  useChannelMembers,
  useChannels,
  usePresence,
  useUser,
  useUserMemberships,
  useUsers,
} from '@pubnub/react-chat-components';
import 'emoji-mart/css/emoji-mart.css';

import { CreateChatModal } from './components/create-chat-modal';
import { ReportUserModal } from './components/report-user-modal';
import { PublicChannelsModal } from './components/public-channels-modal';
import './moderated-chat.scss';

const defaultChannel = {
  id: 'default',
  name: 'Default Channel',
  description: 'This is the default channel',
};

export default function ModeratedChat() {
  const [theme, setTheme] = useState('light');
  const [currentChannel, setCurrentChannel] = useState(defaultChannel);
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const [showPublicChannelsModal, setShowPublicChannelsModal] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [showReportUserModal, setShowReportUserModal] = useState(false);
  const [channelsFilter, setChannelsFilter] = useState('');
  const [membersFilter, setMembersFilter] = useState('');
  const [reportedMessage, setReportedMessage] = useState(null);

  const pubnub = usePubNub();
  const uuid = pubnub.getUUID();
  const [currentUser] = useUser({ uuid });
  const [allUsers] = useUsers({ include: { customFields: true } });
  const [allChannels] = useChannels({ include: { customFields: true } });
  const [joinedChannels, , refetchJoinedChannels] = useUserMemberships({
    include: { channelFields: true, customChannelFields: true },
  });
  const [channelMembers, , refetchChannelMemberships, totalChannelMembers] = useChannelMembers({
    channel: currentChannel.id,
    include: { customUUIDFields: true },
  });
  const [presenceData] = usePresence({
    channels: joinedChannels.length ? joinedChannels.map(c => c.id) : [currentChannel.id],
  });

  const leaveChannel = async (channel, event) => {
    event.stopPropagation();
    await pubnub.objects.removeMemberships({ channels: [channel.id] });
    setAnotherCurrentChannel(channel.id);
  };

  const refreshMemberships = useCallback(
    (event) => {
      if (event.channel.startsWith('user_')) refetchJoinedChannels();
      if (event.channel === currentChannel.id) refetchChannelMemberships();
    },
    [currentChannel, refetchJoinedChannels, refetchChannelMemberships]
  );

  const setAnotherCurrentChannel = (channelId) => {
    if (currentChannel.id === channelId) {
      const newCurrentChannel = joinedChannels?.find((ch) => ch.id !== channelId);
      if (newCurrentChannel) setCurrentChannel(newCurrentChannel);
    }
  };

  const handleError = (e) => {
    if (
      (e.status?.operation === 'PNPublishOperation' && e.status?.statusCode === 403) ||
      e.message.startsWith('Publish failed')
    ) {
      alert(
        'Your message was blocked. Perhaps you tried to use offensive language or send an image that contains nudity?'
      );
    }
  };

  useEffect(() => {
    if (currentChannel.id === 'default' && joinedChannels.length)
      setCurrentChannel(joinedChannels[0]);
  }, [currentChannel, joinedChannels]);
  
  return (
    <div className={`app-moderated app-moderated--${theme}`}>
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
        In this case it's done in the index.tsx file */}
      {/* Current uuid is passed to channels prop to subscribe and listen to User metadata changes */}
      <Chat
        theme={theme}
        users={allUsers}
        currentChannel={currentChannel.id}
        channels={[...joinedChannels.map((c) => c.id), uuid]}
        onError={handleError}
        onMembership={(e) => refreshMemberships(e)}
      >
        {showPublicChannelsModal && (
          <PublicChannelsModal
            {...{
              groupChannelsToJoin,
              hideModal: () => setShowPublicChannelsModal(false),
              setCurrentChannel,
            }}
          />
        )}
        {showCreateChatModal && (
          <CreateChatModal
            {...{
              currentUser,
              hideModal: () => setShowCreateChatModal(false),
              setCurrentChannel,
              users: allUsers.filter((u) => u.id !== uuid),
            }}
          />
        )}
        {showReportUserModal && (
          <ReportUserModal
            {...{
              currentUser,
              reportedMessage,
              hideModal: () => setShowReportUserModal(false),
              users: allUsers,
            }}
          />
        )}
        {isUserBanned ? (
          <strong className="error">Unfortunately, you were banned from the chat.</strong>
        ) : (
          <>
            <div className={`channels-panel ${showChannels && "shown"}`}>
              <div className="user-info">
                {currentUser && <MemberList members={[currentUser]} selfText="" />}
                <button
                  className="mobile material-icons-outlined"
                  onClick={() => setShowChannels(false)}
                >
                  close
                </button>
              </div>

              <div className="theme-switcher">
                <i className="material-icons-outlined">brightness_4</i>
                <button
                  className={theme}
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <span></span>
                </button>
              </div>

              <div className="filter-input">
                <input
                  onChange={(e) => setChannelsFilter(e.target.value)}
                  placeholder="Search in..."
                  type="text"
                  value={channelsFilter}
                />
                <i className="material-icons-outlined">search</i>
              </div>

              <div className="channel-lists">
                <h2>
                  Channels{" "}
                  <button
                    className="material-icons-outlined"
                    onClick={() => setShowPublicChannelsModal(true)}
                  >
                    add_circle_outline
                  </button>
                </h2>
                <div>
                  <ChannelList
                    channels={groupChannels}
                    onChannelSwitched={(channel) => setCurrentChannel(channel)}
                    extraActionsRenderer={(c) => (
                      <div onClick={(e) => leaveChannel(c, e)} title="Leave channel">
                        <i className="material-icons-outlined small">logout</i>
                      </div>
                    )}
                  />
                </div>
                <h2>
                  Direct chats{" "}
                  <button
                    className="material-icons-outlined"
                    onClick={() => setShowCreateChatModal(true)}
                  >
                    add_circle_outline
                  </button>
                </h2>
                <div>
                  <ChannelList
                    channels={directChannels}
                    onChannelSwitched={(channel) => setCurrentChannel(channel)}
                    extraActionsRenderer={(c) => (
                      <div onClick={(e) => leaveChannel(c, e)} title="Leave channel">
                        <i className="material-icons-outlined small">logout</i>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="chat-window">
              <div className="channel-info">
                <button
                  className="mobile material-icons-outlined"
                  onClick={() => setShowChannels(true)}
                >
                  menu
                </button>
                <span onClick={() => setShowMembers(!showMembers)}>
                  <strong>
                    {currentChannel.name || currentChannel.id}
                    {!isUserBlocked && <i className="material-icons-outlined">arrow_right</i>}
                  </strong>
                  <p>{totalChannelMembers} members</p>
                </span>
                <hr />
              </div>

              {isUserBlocked ? (
                <strong className="error">
                  Unfortunately, you were blocked from this channel.
                </strong>
              ) : (
                <>
                  <MessageList
                    fetchMessages={20}
                    enableReactions={!isUserMuted}
                    reactionsPicker={isUserMuted ? undefined : <Picker theme={theme} />}
                    extraActionsRenderer={(message) =>
                      isUserMuted ? (
                        <></>
                      ) : (
                        <div
                          onClick={() => {
                            setReportedMessage(message);
                            setShowReportUserModal(true);
                          }}
                          title="Report user"
                        >
                          <i className="material-icons-outlined">campaign</i>
                        </div>
                      )
                    }
                  >
                    <TypingIndicator />
                  </MessageList>
                  <hr />
                  <MessageInput
                    disabled={isUserMuted}
                    typingIndicator
                    fileUpload="image"
                    emojiPicker={<Picker theme={theme} />}
                    placeholder={isUserMuted ? "You were muted from this channel" : "Send message"}
                  />
                </>
              )}
            </div>

            <div className={`members-panel ${showMembers && !isUserBlocked ? "shown" : "hidden"}`}>
              <h2>
                Members
                <button className="material-icons-outlined" onClick={() => setShowMembers(false)}>
                  close
                </button>
              </h2>
              <div className="filter-input">
                <input
                  onChange={(e) => setMembersFilter(e.target.value)}
                  placeholder="Search in members"
                  type="text"
                  value={membersFilter}
                />
                <i className="material-icons-outlined">search</i>
              </div>
              <MemberList
                members={channelMembers.filter((c) =>
                  c.name?.toLowerCase().includes(membersFilter.toLowerCase())
                )}
                presentMembers={presentUUIDs}
              />
            </div>
          </>
        )}
      </Chat>
    </div>
  );
}
