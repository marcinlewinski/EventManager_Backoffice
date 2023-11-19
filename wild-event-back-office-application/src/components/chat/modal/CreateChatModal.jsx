import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { MemberList, getNameInitials, getPredefinedColor } from "@pubnub/react-chat-components";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Button, Grid } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';

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
    <Dialog open={true} onClose={hideModal} fullWidth maxWidth="sm">
      <IconButton onClick={hideModal} style={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogTitle style={{ textAlign: 'center', margin: '10px 0' }}>
        New Chat
      </DialogTitle>
      <DialogContent style={{ padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Search"
              onChange={(e) => setUsersFilter(e.target.value)}
              type="text"
              size="small"
              fullWidth
              value={usersFilter}
              InputProps={{ endAdornment: <SearchIcon /> }}
            />
          </Grid>
          <Grid item xs={12}>
            <h2 style={{ margin: '10px 0' }}>Users</h2>
          </Grid>
          <Grid item xs={12} style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <MemberList
              members={users.filter((u) => u.name?.toLowerCase().includes(usersFilter.toLowerCase()))}
              onMemberClicked={(user) => createChat(user)}
              memberRenderer={
                showGroups
                  ? (user) => SelectableUserRenderer({ user, selectedUsers, handleCheck })
                  : undefined
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setShowGroups(!showGroups)} style={{ display: 'flex', alignItems: 'center' }}>
            {showGroups ? <ChevronLeftIcon /> : <PeopleIcon />}
            <span style={{ marginLeft: 8, fontSize: '14px' }}>Create group chat</span>
          </IconButton>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        {showGroups && selectedUsers.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            disabled={creatingChannel}
            onClick={() => createChat()}
          >
            Start messaging
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateChatModal;

