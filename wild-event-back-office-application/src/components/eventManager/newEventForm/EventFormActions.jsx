import React from 'react';
import { DialogActions, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export const EventFormActions = ({ pickedEvent, isUpdateEvent, formik, isLoading, closeModal, deleteEvent }) => {
    return (
        <>
            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    Cancel
                </Button>
                {isUpdateEvent ? (
                    <>
                        <Button onClick={(event) => formik.handleSubmit(event, true)} color="primary" type="submit" disabled={isLoading}>
                            Update
                        </Button>
                        <Button onClick={() => deleteEvent(pickedEvent)} color="error" type="submit" disabled={isLoading}>
                            Delete
                        </Button>
                    </>
                ) : (
                    <Button onClick={formik.handleSubmit} color="primary" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <CircularProgress
                                sx={{
                                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                                    position: 'absolute',
                                }}
                                size={20}
                                thickness={4}
                            />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                )}
            </DialogActions>
        </>
    )
}