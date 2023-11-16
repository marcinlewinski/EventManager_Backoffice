import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { MemberList, getNameInitials, getPredefinedColor } from "@pubnub/react-chat-components";

const CreateChatModal = ({ users, currentUser, setCurrentChannel, hideModal }) => {
  const pubnub = usePubNub();
  const [creatingChannel, setCreatingChannel] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersFilter, setUsersFilter] = useState("");
  const [channelName, setChannelName] = useState("");

  const handleCheck = (member) => {
    setSelectedUsers((users) => {
      return users.find((m) => m.id === member.id)
        ? users.filter((m) => m.id !== member.id)
        : [...users, member];
    });
  };



  const createChat = async (user) => {
    if (creatingChannel) return;
    setCreatingChannel(true);
    let uuids, channel, localData, remoteData;
    const randomHex = [...Array(27)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    const custom = { thumb: `https://www.gravatar.com/avatar/${randomHex}?s=256&d=identicon` };

    if (user) {
      const users = [currentUser, user];
      uuids = users.map((m) => m.id).sort();
      channel = `direct.${uuids.join("@")}`;
      remoteData = {
        name: users.map((m) => m.name).sort().join(" and "),
        custom,
      };
      localData = {
        name: user.name,
        custom: { thumb: user.profileUrl },
      };
    } else {
      const users = [currentUser, ...selectedUsers];
      uuids = users.map((m) => m.id).sort();
      channel = `group.${randomHex}`;
      const name = channelName || users.map((m) => m.name?.split(" ")[0]).sort().join(", ");
      remoteData = { name, custom };
      localData = remoteData;
    }

    await pubnub.objects.setChannelMetadata({ channel, data: remoteData });
    await pubnub.objects.setChannelMembers({ channel, uuids });
    setCurrentChannel({ id: channel, ...localData });
    setCreatingChannel(false);
    hideModal();
  };

  const SelectableUserRenderer = ({ user, selectedUsers, handleCheck }) => {
    const userSelected = selectedUsers.find((m) => m.id === user.id);
    return (
      <div key={user.id} className="pn-member" onClick={() => handleCheck(user)}>
             <div className="pn-member__avatar" style={{ backgroundColor: getPredefinedColor(user.id) }}>
          {user.profileUrl ? (
            <img src={user.profileUrl} alt="User avatar" />
          ) : (
            getNameInitials(user.name || user.id)
          )}
        </div>
        <div className="pn-member__main">
          <p className="pn-member__name">{user.name}</p>
          <p className="pn-member__title">{user.custom?.title}</p>
        </div>
        <div className={`check-icon ${userSelected && "checked"}`}>
          {userSelected && <i className="material-icons-outlined">check</i>}
        </div>
      </div>
    );
  };
  

  return (
    <div className="overlay">
       <div className="modal create-chat-modal">
        <div className="header">
          {showGroups && (
            <button className="material-icons-outlined" onClick={() => setShowGroups(false)}>
              chevron_left
            </button>
          )}
          <strong>New chat</strong>
          <button className="material-icons-outlined" onClick={() => hideModal()}>
            close
          </button>
        </div>

        <div className="filter-input">
          <input
            onChange={(e) => setUsersFilter(e.target.value)}
            placeholder="Search in users"
            type="text"
            value={usersFilter}
          />
          <i className="material-icons-outlined">search</i>
        </div>

        {showGroups ? (
          <input
            className="large"
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Group chat name (optional)"
            type="text"
            value={channelName}
          />
        ) : (
          <button className="group-button" onClick={() => setShowGroups(true)}>
            <i className="material-icons-outlined">people</i>
            <p>New group chat</p>
            <i className="material-icons-outlined">chevron_right</i>
          </button>
        )}

        <h2>Users</h2>
        <MemberList
          members={users.filter((u) => u.name?.toLowerCase().includes(usersFilter.toLowerCase()))}
          onMemberClicked={(user) => createChat(user)}
          memberRenderer={
            showGroups
              ? (user) => SelectableUserRenderer({ user, selectedUsers, handleCheck })
              : undefined
          }
        />
        {!!selectedUsers.length && (
          <div className="footer">
            <button disabled={creatingChannel} onClick={() => createChat()}>
              Create group chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChatModal;

