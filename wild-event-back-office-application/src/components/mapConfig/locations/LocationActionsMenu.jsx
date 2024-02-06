import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';

const LocationActionsMenu = ({ onEdit, onDeactivate }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <MoreVertIcon onClick={handleMenuOpen} style={{ cursor: 'pointer' }} />
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          onEdit();
        }}>Edit</MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          onDeactivate();
        }}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}

export default LocationActionsMenu;