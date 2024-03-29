import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

const LocationDeleteDialog = ({ open, handleClose, handleConfirm, closeModal }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Delete location"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this location?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={closeModal}
                    color="primary">
                    No
                </Button>
                <Button
                    onClick={() => {
                        handleConfirm();
                        handleClose();
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationDeleteDialog;
