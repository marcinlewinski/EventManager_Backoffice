import React from 'react';
import { DialogActions, Button } from '@mui/material';
import { DeleteIcon, SaveIcon, SendIcon, LoadingButton } from '@mui/icons-material';

export const EventFormActions = ({ pickedEvent, isUpdateEvent, formik, isLoading, closeModal, deleteEvent }) => {
    return (
        <>
            <DialogActions>
                <Button variant="outlined" size='small'
                    onClick={closeModal} color="primary">
                    Cancel
                </Button>
                {isUpdateEvent ? (
                    <>
                        <LoadingButton
                            size="small"
                            color="secondary"
                            onClick={formik.handleSubmit}
                            loadingPosition="start"
                            endIcon={<SaveIcon />}
                            loading={isLoading}
                            variant="contained"
                        >
                            <span>Save</span>
                        </LoadingButton>
                        <LoadingButton
                            size="small"
                            onClick={() => deleteEvent(pickedEvent)}
                            endIcon={<DeleteIcon />}
                            loading={isLoading}
                            loadingPosition="end"
                            variant="contained"
                            color="error"
                        >
                            <span>Delete</span>
                        </LoadingButton>
                    </>
                ) : (
                    <LoadingButton
                        size="small"
                        onClick={formik.handleSubmit}
                        endIcon={<SendIcon />}
                        loading={isLoading}
                        loadingPosition="end"
                        variant="contained"
                    >
                        <span>Submit</span>
                    </LoadingButton>
                )}
            </DialogActions>
        </>
    )
}