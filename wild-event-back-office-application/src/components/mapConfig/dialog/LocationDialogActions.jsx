import React from "react";
import { Button, DialogActions } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

export const LocationDialogActions = ({loading, formik, closeModal, location }) => {

    return (
        <>
            <DialogActions>
                <Button variant="outlined" size="small" onClick={closeModal} color="primary">
                    Cancel
                </Button>
                {location ? (
                    <LoadingButton
                        size="small"
                        color="secondary"
                        onClick={formik.handleSubmit}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        loading={loading}
                        variant="contained"
                    >
                        <span>Save</span>
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        size="small"
                        onClick={formik.handleSubmit}
                        endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        <span>Send</span>
                    </LoadingButton>
                )}
            </DialogActions>
        </>
    )
}