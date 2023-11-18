import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { MemberList, getNameInitials, getPredefinedColor } from "@pubnub/react-chat-components";
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

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
            <IconButton onClick={() => setShowGroups(false)}>
              <ChevronLeftIcon />
            </IconButton>
          )}
          <strong>New chat</strong>
          <IconButton onClick={() => hideModal()}>
            <CloseIcon />
          </IconButton>
        </div>

        <div>
          <TextField
            label="Search"
            onChange={(e) => setUsersFilter(e.target.value)}
            type="text"
            size="small"
            value={usersFilter}
            InputProps={{
              endAdornment: (
                <SearchIcon />
              ),
            }}
          />
        </div>

        {showGroups ? (
          <TextField
            onChange={(e) => setChannelName(e.target.value)}
            label="Chat name"
            placeholder="Group chat name (optional)"
            type="text"
            size="small"
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
            <Button
              variant="contained"
              color="primary"
              disabled={creatingChannel}
              onClick={() => createChat()}
              style={{
                color: 'white',             
                padding: '10px 20px',       
                fontSize: '12px',           
                fontWeight: 'bold',        
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', 
                marginTop: '10px',          
                textTransform: 'none',   
              }}
            >
              Create group chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChatModal;
