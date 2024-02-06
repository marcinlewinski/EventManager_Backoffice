import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';


const ConfirmationDialog = ({ isLoading, open, handleClose, handleConfirm }) => {
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
                <LoadingButton
                    size="small"
                    onClick={() => {
                        handleConfirm();
                    }}
                    endIcon={<DeleteIcon />}
                    loading={isLoading}
                    loadingPosition="end"
                    variant="outlined"
                    color="error"
                >
                    <span>Yes</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
