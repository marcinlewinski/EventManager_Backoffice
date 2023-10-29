import React, { useState, useEffect } from 'react';
import { Grid, Box, DialogContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { submitLocation } from '../../../services/LocationService';
import MapForm from '../map/MapForm';
import { useUser } from "../../../services/useUser";
import { useFormik, } from 'formik';
import locationBasicSchema from '../validationSchema/locationBasicSchema';
import { LocationDialogFields } from './LocationDialogFields';
import { LocationDialogActions } from './LocationDialogActions';



const LocationDialog = ({ mapLocations, open, location, handleClose, closeModal }) => {
    const { token } = useUser();
    const [coordinate, setCoordinate] = useState({
        latitude: mapLocations.coordinate ? mapLocations.coordinate.latitude : 0.0,
        longitude: mapLocations.coordinate ? mapLocations.coordinate.longitude : 0.0
    });

    const formik = useFormik({
        initialValues: {
            id: null,
            title: "",
            description: "",
            longitude: 0.0,
            latitude: 0.0

        },
        validationSchema: locationBasicSchema,
        onSubmit: async (values) => {
            await submitLocation(token, values);
            //add to context 
            //update temp state or read from context insted of fetching every time
            await handleClose();
            formik.resetForm()
        },
    });

    useEffect(() => {
        formik.setFieldValue("longitude", coordinate.longitude);
        formik.setFieldValue("latitude", coordinate.latitude)
    }, [coordinate])

    useEffect(() => {
        if (open) {
            formik.resetForm();
            if (location) {
                formik.setFieldValue("id", location.id);
                formik.setFieldValue("title", location.title);
                formik.setFieldValue("description", location.description);
                formik.setFieldValue("longitude", location.longitude);
                formik.setFieldValue("latitude", location.latitude);
            } else {
                formik.setFieldValue("id", null);
                formik.setFieldValue("title", "");
                formik.setFieldValue("description", "");
                formik.setFieldValue("longitude", mapLocations.coordinate.longitude);
                formik.setFieldValue("latitude", mapLocations.coordinate.latitude);
            }
        }
    }, [open, location]);


    return (
        <Dialog fullWidth open={open} onClose={handleClose} style={{}}>
            <DialogTitle>{location ? "Location details" : "Add new location"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                       <LocationDialogFields formik={formik}>
                       </LocationDialogFields>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ width: '290px', height: '400px' }}>
                            <MapForm mapLocations={mapLocations} location={location} coordinate={coordinate} setCoordinate={(e) => setCoordinate(e)}></MapForm>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
           <LocationDialogActions formik={formik} closeModal={closeModal} location={location}>
           </LocationDialogActions>
        </Dialog>
    );
};

export default LocationDialog;