import React from "react";
import { Button, DialogActions } from '@mui/material';

export const LocationDialogActions = ({ formik, closeModal, location }) => {

    return (
        <>
            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={formik.handleSubmit} type="submit" color="primary">
                    {location ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </>
    )
}