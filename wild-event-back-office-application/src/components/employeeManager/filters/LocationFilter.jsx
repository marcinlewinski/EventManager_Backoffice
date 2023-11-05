import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Box } from '@mui/material';

const LocationFilter = ({ allLocations, onLocationSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLocationSelect = (location) => {
        onLocationSelect(location === "None" ? "" : location);
        setAnchorEl(null);
    };

    return (
        <Box>
            <IconButton aria-label="filter" size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
                <FilterListIcon fontSize="inherit" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem key="none" onClick={() => handleLocationSelect("None")}>
                    None
                </MenuItem>
                {allLocations?.map((location) => (
                    <MenuItem key={location.id} onClick={() => handleLocationSelect(location.title)}>
                        {location.title}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}

export default LocationFilter;
