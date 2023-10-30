import React, { useState } from "react";
import TableContainer from '@mui/material/TableContainer';
import { Box, Paper } from "@mui/material";
import LocationDialog from "../dialog/LocationDialog"
import LocationDeleteDialog from "../dialog/LocationDeleteDialog";
import MuiAlert from '@mui/material/Alert';
import { deleteLocation } from "../../../services/LocationService";
import Snackbar from '@mui/material/Snackbar';
import { useUser } from "../../../services/useUser";
import { LocationTableFields } from "./LocationTableFields";

const LocationsEditList = ({updateLocationInMap, deleteLocationFromMap, addLocationIntoMap, mapLocations, setLocations }) => {
  const { token } = useUser();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationUpdate, setLocationUpdate] = useState(null);
  const [locationDeleteId, setLocationDeleteId] = useState(null);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenDeleteDialog = (id) => {
    setLocationDeleteId(id)
    setDeleteDialogOpen(true)
  };
  const setUpdating = (location) => {
    setLocationUpdate(location)
    setUpdateDialogOpen(true)
  };

  const finishUpdating = () => {
    
    closeModal();
    setLocations();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarInfo(prev => ({
      ...prev,
      open: false
    }));
  };

  const deleteLocationById = async () => {
    deleteLocationFromMap(locationDeleteId);
    try {
      await deleteLocation(token, locationDeleteId)
      setSnackbarInfo({
        open: true,
        message: 'Location has been deleted!',
        severity: 'success'
      });
    
    } catch (error) {
      console.error("Could not delete location:", error)
    }
  }
  const closeModal = () => {
    setUpdateDialogOpen(false)
    setDeleteDialogOpen(false)
    setLocationUpdate(null)
    setLocationDeleteId(null)
  }
  return <Box>

    <TableContainer component={Paper}>
      <LocationTableFields
        mapLocations={mapLocations}
        setUpdateDialogOpen={setUpdateDialogOpen}
        setUpdating={setUpdating}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
      >
      </LocationTableFields>
    </TableContainer>
    <LocationDialog 
    updateLocationInMap={updateLocationInMap}
      addLocationIntoMap={addLocationIntoMap}
      mapLocations={mapLocations}
      open={updateDialogOpen}
      location={locationUpdate}
      handleClose={() => finishUpdating()}
      closeModal={closeModal}
    />
    <LocationDeleteDialog
      open={deleteDialogOpen}
      handleClose={() => finishUpdating()}
      handleConfirm={deleteLocationById}
      closeModal={closeModal}
    />
    <Snackbar open={snackbarInfo.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
      <MuiAlert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} elevation={6} variant="filled">
        {snackbarInfo.message}
      </MuiAlert>
    </Snackbar>
  </Box >

    ;
};

export default LocationsEditList;
