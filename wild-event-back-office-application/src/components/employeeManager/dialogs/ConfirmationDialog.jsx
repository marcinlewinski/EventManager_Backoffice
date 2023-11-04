import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

const ConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Deactivate User"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to deactivate this user?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="primary"
                    variant="outlined"
                    size='small'
                >
                    No
                </Button>
                <Button
                    onClick={() => {
                        handleConfirm();
                        handleClose();
                    }}
                    color="primary"
                    variant="outlined"
                    size='small'
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
